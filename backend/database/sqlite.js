const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'agency.sqlite');

let db = null;
let isBetterSqlite = false;

try {
  const Database = require('better-sqlite3');
  db = new Database(dbPath);
  isBetterSqlite = true;
  console.log('✅ SQLite Database Connected via better-sqlite3 at:', dbPath);
} catch (e1) {
  try {
    const sqlite3 = require('sqlite3').verbose();
    db = new sqlite3.Database(dbPath);
    console.log('✅ SQLite Database Connected via sqlite3 at:', dbPath);
  } catch (e2) {
    console.error('SQLite connection error:', e2.message);
  }
}

// Initial Table Setup ONLY (NO PLACEHOLDERS OR DUMMY DATA)
const initDatabase = () => {
  if (!db) return;

  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS portfolio_items (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      subtitle TEXT DEFAULT '',
      ratio TEXT DEFAULT 'Work Preview - Slot 1 (9:16)',
      category TEXT DEFAULT 'Work Preview',
      tag TEXT DEFAULT 'Work Preview',
      isExclusive INTEGER DEFAULT 0,
      img TEXT NOT NULL,
      mediaUrl TEXT NOT NULL,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS client_applications (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      country TEXT DEFAULT '',
      serviceType TEXT DEFAULT '',
      platform TEXT DEFAULT '',
      contentDetails TEXT DEFAULT '',
      volume TEXT DEFAULT '',
      budget TEXT DEFAULT '',
      message TEXT DEFAULT '',
      status TEXT DEFAULT 'New',
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `;

  if (isBetterSqlite) {
    db.exec(createTableSQL);
  } else {
    db.serialize(() => {
      db.run(createTableSQL);
    });
  }
};

initDatabase();

// Clean Helper Interface
const getAllItems = () => {
  if (!db) return [];
  if (isBetterSqlite) {
    const rows = db.prepare('SELECT * FROM portfolio_items ORDER BY rowid DESC').all();
    return rows.map(r => ({ ...r, _id: r.id, isExclusive: Boolean(r.isExclusive) }));
  }
  return [];
};

const getItemById = (idOrTitle) => {
  if (!db || !idOrTitle) return null;
  const strVal = String(idOrTitle).trim();
  if (isBetterSqlite) {
    const row = db.prepare('SELECT * FROM portfolio_items WHERE id = ? OR LOWER(title) = LOWER(?)').get(strVal, strVal);
    return row ? { ...row, _id: row.id, isExclusive: Boolean(row.isExclusive) } : null;
  }
  return null;
};

const insertItem = (item) => {
  if (!db) return item;
  const itemId = item._id || item.id || ('p-' + Date.now());
  const title = item.title || 'Work Preview Item';
  const subtitle = item.subtitle || '';
  const ratio = item.ratio || 'Work Preview - Slot 1 (9:16)';
  const category = item.category || 'Work Preview';
  const tag = item.tag || category || 'Work Preview';
  const isExclusive = item.isExclusive ? 1 : 0;
  const img = item.img || item.mediaUrl || '';
  const mediaUrl = item.mediaUrl || item.img || '';

  if (isBetterSqlite) {
    const existing = getItemById(itemId);
    if (existing) {
      const stmt = db.prepare(`
        UPDATE portfolio_items
        SET title = ?, subtitle = ?, ratio = ?, category = ?, tag = ?, isExclusive = ?, img = ?, mediaUrl = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      stmt.run(title, subtitle, ratio, category, tag, isExclusive, img, mediaUrl, itemId);
    } else {
      const stmt = db.prepare(`
        INSERT INTO portfolio_items (id, title, subtitle, ratio, category, tag, isExclusive, img, mediaUrl)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(itemId, title, subtitle, ratio, category, tag, isExclusive, img, mediaUrl);
    }
  }
  return getItemById(itemId) || { ...item, _id: itemId, id: itemId };
};

const deleteItem = (idOrTitle) => {
  if (!db || !idOrTitle) return false;
  const strVal = String(idOrTitle).trim();
  if (isBetterSqlite) {
    const stmt = db.prepare('DELETE FROM portfolio_items WHERE id = ? OR LOWER(title) = LOWER(?)');
    stmt.run(strVal, strVal);
  }
  return true;
};

const clearAllItems = () => {
  if (!db) return;
  if (isBetterSqlite) {
    db.exec('DELETE FROM portfolio_items');
  }
};

module.exports = {
  db,
  getAllItems,
  getItemById,
  insertItem,
  deleteItem,
  clearAllItems,
};
