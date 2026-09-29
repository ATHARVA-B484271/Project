/**
 * In-Memory Data Store for Vercel Serverless deployment
 * Works without MongoDB — data persists within a warm function instance
 * Perfect for demos and college project presentations
 */

const bcrypt = require('bcryptjs');
const { EventEmitter } = require('events');

class MemoryDB extends EventEmitter {
  constructor() {
    super();
    this.users = new Map();
    this.assignments = new Map();
    this.submissions = new Map();
    this.notifications = new Map();
    this._idCounter = 1;
    this.seeded = false;
  }

  _newId() {
    const id = String(this._idCounter++).padStart(24, '0');
    return id;
  }

  // ─── Users ─────────────────────────────────────────────────────────────
  async createUser(data) {
    const id = this._newId();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    const user = {
      _id: id,
      id,
      ...data,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async findUser(query) {
    for (const user of this.users.values()) {
      if (query.email && user.email === query.email) return user;
      if (query._id && user._id === query._id) return user;
      if (query.adminId && user.adminId === query.adminId) return user;
      if (query.studentId && user.studentId === query.studentId) return user;
    }
    return null;
  }

  async countUsers() {
    return this.users.size;
  }

  async comparePassword(user, password) {
    return bcrypt.compare(password, user.password);
  }

  // ─── Assignments ────────────────────────────────────────────────────────
  async createAssignment(data) {
    const id = this._newId();
    const assignment = { _id: id, id, ...data, createdAt: new Date(), updatedAt: new Date() };
    this.assignments.set(id, assignment);
    return assignment;
  }

  async findAssignments(query = {}) {
    let results = Array.from(this.assignments.values());
    if (query.createdBy) results = results.filter(a => a.createdBy === query.createdBy);
    return results.sort((a, b) => b.createdAt - a.createdAt);
  }

  async findAssignment(id) {
    return this.assignments.get(id) || null;
  }

  async deleteAssignment(id) {
    return this.assignments.delete(id);
  }

  // ─── Submissions ────────────────────────────────────────────────────────
  async createSubmission(data) {
    const id = this._newId();
    const submission = { _id: id, id, ...data, submittedAt: new Date(), createdAt: new Date() };
    this.submissions.set(id, submission);
    return submission;
  }

  async findSubmissions(query = {}) {
    let results = Array.from(this.submissions.values());
    if (query.assignmentId) results = results.filter(s => s.assignmentId === query.assignmentId);
    if (query.studentId) results = results.filter(s => s.studentId === query.studentId);
    return results.sort((a, b) => b.createdAt - a.createdAt);
  }

  async findSubmission(id) {
    return this.submissions.get(id) || null;
  }

  async updateSubmission(id, data) {
    const existing = this.submissions.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...data, updatedAt: new Date() };
    this.submissions.set(id, updated);
    return updated;
  }

  // ─── Notifications ──────────────────────────────────────────────────────
  async createNotification(data) {
    const id = this._newId();
    const notification = { _id: id, id, isRead: false, ...data, createdAt: new Date() };
    this.notifications.set(id, notification);
    return notification;
  }

  async findNotifications(query = {}) {
    let results = Array.from(this.notifications.values());
    if (query.userId) results = results.filter(n => n.userId === query.userId);
    return results.sort((a, b) => b.createdAt - a.createdAt);
  }

  async markNotificationRead(id) {
    const n = this.notifications.get(id);
    if (n) { n.isRead = true; this.notifications.set(id, n); }
    return n;
  }

  async markAllNotificationsRead(userId) {
    for (const [id, n] of this.notifications.entries()) {
      if (n.userId === userId) { n.isRead = true; this.notifications.set(id, n); }
    }
  }

  async countUnreadNotifications(userId) {
    return Array.from(this.notifications.values()).filter(n => n.userId === userId && !n.isRead).length;
  }
}

// Singleton — shared across warm Vercel invocations
const db = global._memDb || (global._memDb = new MemoryDB());
module.exports = db;
