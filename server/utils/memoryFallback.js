const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const stores = {
  User: [],
  Design: [],
  Product: [],
  Order: [],
};

function matchesFilter(doc, query = {}) {
  return Object.entries(query).every(([key, val]) => {
    if (key === '$or' && Array.isArray(val)) {
      return val.some((sub) => matchesFilter(doc, sub));
    }
    const docVal = doc[key];
    if (val instanceof RegExp) {
      return val.test(String(docVal || ''));
    }
    if (val && typeof val === 'object' && !Array.isArray(val) && !(val instanceof mongoose.Types.ObjectId)) {
      if ('$gte' in val && Number(docVal) < Number(val.$gte)) return false;
      if ('$lte' in val && Number(docVal) > Number(val.$lte)) return false;
      return true;
    }
    return String(docVal) === String(val);
  });
}

function projectFields(doc, fieldsStr) {
  if (!fieldsStr) return doc;
  const parts = fieldsStr.trim().split(/\s+/);
  const exclude = parts.some((p) => p.startsWith('-'));
  if (exclude) {
    const out = { ...doc };
    parts.forEach((p) => {
      if (p.startsWith('-')) delete out[p.slice(1)];
    });
    return out;
  }
  const out = { _id: doc._id };
  parts.forEach((p) => {
    if (p in doc) out[p] = doc[p];
  });
  return out;
}

function applyPopulate(doc, path, select) {
  if (!doc) return doc;
  if (path === 'hotspots.product' && Array.isArray(doc.hotspots)) {
    doc.hotspots = doc.hotspots.map((spot) => {
      const prodId = spot.product?._id || spot.product;
      const found = stores.Product.find((p) => String(p._id) === String(prodId));
      return {
        ...spot,
        product: found ? projectFields(found, select) : spot.product,
      };
    });
  }
  return doc;
}

function makeQuery(initialPromise, isArray) {
  let populateArgs = null;
  let sortSpec = null;
  let selectSpec = null;

  const q = {
    populate(path, select) {
      populateArgs = { path, select };
      return q;
    },
    sort(spec) {
      sortSpec = spec;
      return q;
    },
    select(spec) {
      selectSpec = spec;
      return q;
    },
    then(resolve, reject) {
      return initialPromise
        .then((res) => {
          if (!res) return res;
          const handleDoc = (d) => {
            let copy = typeof d.toObject === 'function' ? { ...d } : { ...d };
            Object.setPrototypeOf(copy, Object.getPrototypeOf(d));
            if (populateArgs) copy = applyPopulate(copy, populateArgs.path, populateArgs.select);
            if (selectSpec) copy = projectFields(copy, selectSpec);
            return copy;
          };

          if (isArray) {
            let arr = res.map(handleDoc);
            if (sortSpec) {
              const entries = Object.entries(sortSpec);
              arr.sort((a, b) => {
                for (const [k, dir] of entries) {
                  const av = a[k] ?? 0;
                  const bv = b[k] ?? 0;
                  if (av < bv) return dir < 0 ? 1 : -1;
                  if (av > bv) return dir < 0 ? -1 : 1;
                }
                return 0;
              });
            }
            return arr;
          }
          return handleDoc(res);
        })
        .then(resolve, reject);
    },
  };
  return q;
}

function wrapRecord(modelName, raw) {
  const store = stores[modelName];
  const doc = { ...raw };

  if (modelName === 'User') {
    doc.matchPassword = function matchPassword(entered) {
      return bcrypt.compare(entered, doc.password);
    };
  }

  doc.save = async function save() {
    const idx = store.findIndex((item) => String(item._id) === String(doc._id));
    doc.updatedAt = new Date();
    if (idx >= 0) {
      store[idx] = doc;
    } else {
      store.push(doc);
    }
    return doc;
  };

  doc.populate = async function populate(path, select) {
    return applyPopulate(doc, path, select);
  };

  return doc;
}

function attachModelStore(Model, modelName) {
  const store = stores[modelName];

  Model.countDocuments = async (query = {}) =>
    store.filter((d) => matchesFilter(d, query)).length;

  Model.deleteMany = async (query = {}) => {
    const remaining = store.filter((d) => !matchesFilter(d, query));
    const deletedCount = store.length - remaining.length;
    store.length = 0;
    store.push(...remaining);
    return { deletedCount };
  };

  Model.insertMany = async (docs) => {
    const inserted = [];
    for (const item of docs) {
      const created = await Model.create(item);
      inserted.push(created);
    }
    return inserted;
  };

  Model.create = async (item) => {
    const now = new Date();
    const copy = {
      ...item,
      _id: item._id || new mongoose.Types.ObjectId(),
      createdAt: now,
      updatedAt: now,
    };

    if (modelName === 'User' && copy.password && !copy.password.startsWith('$2')) {
      const salt = await bcrypt.genSalt(10);
      copy.password = await bcrypt.hash(copy.password, salt);
      copy.favorites = copy.favorites || [];
      copy.role = copy.role || 'user';
    }

    if (modelName === 'Design') {
      copy.hotspots = (copy.hotspots || []).map((h) => ({
        ...h,
        _id: h._id || new mongoose.Types.ObjectId(),
      }));
      copy.reviews = (copy.reviews || []).map((r) => ({
        ...r,
        _id: r._id || new mongoose.Types.ObjectId(),
        createdAt: r.createdAt || now,
      }));
    }

    if (modelName === 'Product') {
      copy.reviews = (copy.reviews || []).map((r) => ({
        ...r,
        _id: r._id || new mongoose.Types.ObjectId(),
        createdAt: r.createdAt || now,
      }));
    }

    const wrapped = wrapRecord(modelName, copy);
    store.push(wrapped);
    return wrapped;
  };

  Model.find = (query = {}) =>
    makeQuery(
      Promise.resolve(store.filter((d) => matchesFilter(d, query))),
      true
    );

  Model.findOne = (query = {}) =>
    makeQuery(
      Promise.resolve(store.find((d) => matchesFilter(d, query)) || null),
      false
    );

  Model.findById = (id) =>
    makeQuery(
      Promise.resolve(store.find((d) => String(d._id) === String(id)) || null),
      false
    );

  Model.distinct = async (field, query = {}) => {
    const filtered = store.filter((d) => matchesFilter(d, query));
    return [...new Set(filtered.map((d) => d[field]).filter(Boolean))];
  };
}

function activateMemoryFallback() {
  const User = require('../models/User');
  const Design = require('../models/Design');
  const Product = require('../models/Product');
  const Order = require('../models/Order');

  attachModelStore(User, 'User');
  attachModelStore(Design, 'Design');
  attachModelStore(Product, 'Product');
  attachModelStore(Order, 'Order');
}

module.exports = { activateMemoryFallback };
