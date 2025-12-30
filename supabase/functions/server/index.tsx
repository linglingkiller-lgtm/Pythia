import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-9c2c6866/health", (c) => {
  return c.json({ status: "ok" });
});

// ============================================
// DATA ENDPOINTS - Revere Platform
// ============================================

// Get Arizona district profiles
app.get("/make-server-9c2c6866/data/az-districts", async (c) => {
  try {
    const profiles = await kv.getByPrefix("az-district-");
    return c.json({ success: true, data: profiles });
  } catch (error) {
    console.error("Error fetching AZ districts:", error);
    return c.json({ success: false, error: "Failed to fetch district profiles" }, 500);
  }
});

// Get single Arizona district profile
app.get("/make-server-9c2c6866/data/az-districts/:districtNumber", async (c) => {
  try {
    const districtNumber = c.req.param("districtNumber");
    const profile = await kv.get(`az-district-${districtNumber}`);
    if (!profile) {
      return c.json({ success: false, error: "District not found" }, 404);
    }
    return c.json({ success: true, data: profile });
  } catch (error) {
    console.error("Error fetching district:", error);
    return c.json({ success: false, error: "Failed to fetch district" }, 500);
  }
});

// Get issues data
app.get("/make-server-9c2c6866/data/issues", async (c) => {
  try {
    const issues = await kv.get("issues-data");
    return c.json({ success: true, data: issues || [] });
  } catch (error) {
    console.error("Error fetching issues:", error);
    return c.json({ success: false, error: "Failed to fetch issues" }, 500);
  }
});

// Get issues mock data (scores, narratives, etc.)
app.get("/make-server-9c2c6866/data/issues-mock", async (c) => {
  try {
    const mockData = await kv.get("issues-mock-data");
    return c.json({ success: true, data: mockData || {} });
  } catch (error) {
    console.error("Error fetching issues mock data:", error);
    return c.json({ success: false, error: "Failed to fetch issues data" }, 500);
  }
});

// Get bills data
app.get("/make-server-9c2c6866/data/bills", async (c) => {
  try {
    const bills = await kv.get("bills-data");
    return c.json({ success: true, data: bills || [] });
  } catch (error) {
    console.error("Error fetching bills:", error);
    return c.json({ success: false, error: "Failed to fetch bills" }, 500);
  }
});

// Get clients data
app.get("/make-server-9c2c6866/data/clients", async (c) => {
  try {
    const clients = await kv.get("clients-data");
    return c.json({ success: true, data: clients || [] });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return c.json({ success: false, error: "Failed to fetch clients" }, 500);
  }
});

// Get work hub data
app.get("/make-server-9c2c6866/data/work-hub", async (c) => {
  try {
    const workHub = await kv.get("work-hub-data");
    return c.json({ success: true, data: workHub || {} });
  } catch (error) {
    console.error("Error fetching work hub data:", error);
    return c.json({ success: false, error: "Failed to fetch work hub data" }, 500);
  }
});

// Get analytics data
app.get("/make-server-9c2c6866/data/analytics", async (c) => {
  try {
    const analytics = await kv.get("analytics-data");
    return c.json({ success: true, data: analytics || {} });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return c.json({ success: false, error: "Failed to fetch analytics" }, 500);
  }
});

// Get campaign data
app.get("/make-server-9c2c6866/data/campaigns", async (c) => {
  try {
    const campaigns = await kv.get("campaign-data");
    return c.json({ success: true, data: campaigns || [] });
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return c.json({ success: false, error: "Failed to fetch campaigns" }, 500);
  }
});

// Get team data
app.get("/make-server-9c2c6866/data/team", async (c) => {
  try {
    const team = await kv.get("team-data");
    return c.json({ success: true, data: team || [] });
  } catch (error) {
    console.error("Error fetching team data:", error);
    return c.json({ success: false, error: "Failed to fetch team data" }, 500);
  }
});

// Get notifications
app.get("/make-server-9c2c6866/data/notifications", async (c) => {
  try {
    const notifications = await kv.get("notifications-data");
    return c.json({ success: true, data: notifications || [] });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return c.json({ success: false, error: "Failed to fetch notifications" }, 500);
  }
});

// Get records data
app.get("/make-server-9c2c6866/data/records", async (c) => {
  try {
    const records = await kv.get("records-data");
    return c.json({ success: true, data: records || [] });
  } catch (error) {
    console.error("Error fetching records:", error);
    return c.json({ success: false, error: "Failed to fetch records" }, 500);
  }
});

// ============================================
// MULTI-TENANCY ENDPOINTS - User Profiles & Organizations
// ============================================

// Get user profile
app.get("/make-server-9c2c6866/user/profile/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const profile = await kv.get(`user:${userId}:profile`);
    return c.json({ success: true, data: profile });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return c.json({ success: false, error: "Failed to fetch user profile" }, 500);
  }
});

// Create or update user profile
app.post("/make-server-9c2c6866/user/profile", async (c) => {
  try {
    const body = await c.req.json();
    const { userId, email, fullName, avatarUrl, title, department } = body;
    
    const now = new Date().toISOString();
    const existingProfile = await kv.get(`user:${userId}:profile`);
    
    const profile = {
      userId,
      email,
      fullName: fullName || email,
      avatarUrl: avatarUrl || null,
      title: title || "",
      department: department || "",
      createdAt: existingProfile?.createdAt || now,
      updatedAt: now,
    };
    
    await kv.set(`user:${userId}:profile`, profile);
    return c.json({ success: true, data: profile });
  } catch (error) {
    console.error("Error saving user profile:", error);
    return c.json({ success: false, error: "Failed to save user profile" }, 500);
  }
});

// Get user organizations index
app.get("/make-server-9c2c6866/user/orgs/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const orgIndex = await kv.get(`user:${userId}:orgs`);
    return c.json({ success: true, data: orgIndex || { orgIds: [], activeOrgId: null } });
  } catch (error) {
    console.error("Error fetching user orgs:", error);
    return c.json({ success: false, error: "Failed to fetch user orgs" }, 500);
  }
});

// Update user organizations index
app.post("/make-server-9c2c6866/user/orgs", async (c) => {
  try {
    const body = await c.req.json();
    const { userId, orgIds, activeOrgId } = body;
    
    const orgIndex = {
      orgIds: Array.from(new Set(orgIds)), // Deduplicate
      activeOrgId: activeOrgId || null,
    };
    
    await kv.set(`user:${userId}:orgs`, orgIndex);
    return c.json({ success: true, data: orgIndex });
  } catch (error) {
    console.error("Error updating user orgs:", error);
    return c.json({ success: false, error: "Failed to update user orgs" }, 500);
  }
});

// Get organization metadata
app.get("/make-server-9c2c6866/org/meta/:orgId", async (c) => {
  try {
    const orgId = c.req.param("orgId");
    const meta = await kv.get(`org:${orgId}:meta`);
    
    if (!meta) {
      return c.json({ success: false, error: "Organization not found" }, 404);
    }
    
    return c.json({ success: true, data: meta });
  } catch (error) {
    console.error("Error fetching org meta:", error);
    return c.json({ success: false, error: "Failed to fetch org meta" }, 500);
  }
});

// Get multiple organization metadata (batch)
app.post("/make-server-9c2c6866/org/meta/batch", async (c) => {
  try {
    const body = await c.req.json();
    const { orgIds } = body;
    
    if (!Array.isArray(orgIds) || orgIds.length === 0) {
      return c.json({ success: true, data: [] });
    }
    
    const keys = orgIds.map(id => `org:${id}:meta`);
    const metas = await kv.mget(keys);
    
    return c.json({ success: true, data: metas });
  } catch (error) {
    console.error("Error fetching org metas:", error);
    return c.json({ success: false, error: "Failed to fetch org metas" }, 500);
  }
});

// Get organization members
app.get("/make-server-9c2c6866/org/members/:orgId", async (c) => {
  try {
    const orgId = c.req.param("orgId");
    const members = await kv.get(`org:${orgId}:members`);
    
    return c.json({ success: true, data: members || {} });
  } catch (error) {
    console.error("Error fetching org members:", error);
    return c.json({ success: false, error: "Failed to fetch org members" }, 500);
  }
});

// Create organization (onboarding)
app.post("/make-server-9c2c6866/org/create", async (c) => {
  try {
    const body = await c.req.json();
    const { orgId, name, slug, userId, userEmail } = body;
    
    const now = new Date().toISOString();
    
    // Create org metadata
    const orgMeta = {
      orgId,
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      createdBy: userId,
      createdAt: now,
      updatedAt: now,
    };
    
    // Create org members with user as owner
    const orgMembers = {
      [userId]: {
        role: "owner",
        status: "active",
        addedAt: now,
      },
    };
    
    // Write org data
    await kv.set(`org:${orgId}:meta`, orgMeta);
    await kv.set(`org:${orgId}:members`, orgMembers);
    
    // Update user's org index
    const existingOrgIndex = await kv.get(`user:${userId}:orgs`) || { orgIds: [], activeOrgId: null };
    const updatedOrgIds = Array.from(new Set([...existingOrgIndex.orgIds, orgId]));
    
    const updatedOrgIndex = {
      orgIds: updatedOrgIds,
      activeOrgId: orgId,
    };
    
    await kv.set(`user:${userId}:orgs`, updatedOrgIndex);
    
    // Ensure user profile exists
    const existingProfile = await kv.get(`user:${userId}:profile`);
    if (!existingProfile) {
      const profile = {
        userId,
        email: userEmail,
        fullName: userEmail,
        avatarUrl: null,
        title: "",
        department: "",
        createdAt: now,
        updatedAt: now,
      };
      await kv.set(`user:${userId}:profile`, profile);
    }
    
    return c.json({ 
      success: true, 
      data: { 
        org: orgMeta, 
        members: orgMembers,
        orgIndex: updatedOrgIndex,
      } 
    });
  } catch (error) {
    console.error("Error creating organization:", error);
    return c.json({ success: false, error: `Failed to create organization: ${error.message}` }, 500);
  }
});

// Update org member role
app.post("/make-server-9c2c6866/org/member/role", async (c) => {
  try {
    const body = await c.req.json();
    const { orgId, targetUserId, newRole } = body;
    
    const members = await kv.get(`org:${orgId}:members`) || {};
    
    if (!members[targetUserId]) {
      return c.json({ success: false, error: "User not found in organization" }, 404);
    }
    
    members[targetUserId].role = newRole;
    members[targetUserId].updatedAt = new Date().toISOString();
    
    await kv.set(`org:${orgId}:members`, members);
    
    return c.json({ success: true, data: members });
  } catch (error) {
    console.error("Error updating member role:", error);
    return c.json({ success: false, error: "Failed to update member role" }, 500);
  }
});

// Disable org member
app.post("/make-server-9c2c6866/org/member/disable", async (c) => {
  try {
    const body = await c.req.json();
    const { orgId, targetUserId } = body;
    
    const members = await kv.get(`org:${orgId}:members`) || {};
    
    if (!members[targetUserId]) {
      return c.json({ success: false, error: "User not found in organization" }, 404);
    }
    
    members[targetUserId].status = "disabled";
    members[targetUserId].disabledAt = new Date().toISOString();
    
    await kv.set(`org:${orgId}:members`, members);
    
    return c.json({ success: true, data: members });
  } catch (error) {
    console.error("Error disabling member:", error);
    return c.json({ success: false, error: "Failed to disable member" }, 500);
  }
});

// ============================================
// INVITE ENDPOINTS
// ============================================

// Create invite
app.post("/make-server-9c2c6866/org/invite/create", async (c) => {
  try {
    const body = await c.req.json();
    const { orgId, inviteId, email, role, token, createdBy, expiresAt } = body;
    
    const now = new Date().toISOString();
    
    const invite = {
      inviteId,
      orgId,
      email,
      role,
      status: "pending",
      token,
      createdBy,
      createdAt: now,
      expiresAt,
      acceptedBy: null,
      acceptedAt: null,
      version: 1,
    };
    
    // Write invite
    await kv.set(`org:${orgId}:invite:${inviteId}`, invite);
    
    // Update invites index
    const invitesIndex = await kv.get(`org:${orgId}:invites:index`) || { inviteIds: [], version: 0 };
    invitesIndex.inviteIds.push(inviteId);
    invitesIndex.version = (invitesIndex.version || 0) + 1;
    await kv.set(`org:${orgId}:invites:index`, invitesIndex);
    
    // Create token lookup
    await kv.set(`inviteToken:${token}`, { inviteId, orgId });
    
    return c.json({ success: true, data: invite });
  } catch (error) {
    console.error("Error creating invite:", error);
    return c.json({ success: false, error: "Failed to create invite" }, 500);
  }
});

// Get invite by token
app.get("/make-server-9c2c6866/invite/token/:token", async (c) => {
  try {
    const token = c.req.param("token");
    const tokenData = await kv.get(`inviteToken:${token}`);
    
    if (!tokenData) {
      return c.json({ success: false, error: "Invite not found" }, 404);
    }
    
    const invite = await kv.get(`org:${tokenData.orgId}:invite:${tokenData.inviteId}`);
    
    if (!invite) {
      return c.json({ success: false, error: "Invite not found" }, 404);
    }
    
    return c.json({ success: true, data: invite });
  } catch (error) {
    console.error("Error fetching invite:", error);
    return c.json({ success: false, error: "Failed to fetch invite" }, 500);
  }
});

// Get org invites
app.get("/make-server-9c2c6866/org/invites/:orgId", async (c) => {
  try {
    const orgId = c.req.param("orgId");
    const invitesIndex = await kv.get(`org:${orgId}:invites:index`) || { inviteIds: [] };
    
    const invites = [];
    for (const inviteId of invitesIndex.inviteIds) {
      const invite = await kv.get(`org:${orgId}:invite:${inviteId}`);
      if (invite) {
        invites.push(invite);
      }
    }
    
    return c.json({ success: true, data: invites });
  } catch (error) {
    console.error("Error fetching invites:", error);
    return c.json({ success: false, error: "Failed to fetch invites" }, 500);
  }
});

// Accept invite
app.post("/make-server-9c2c6866/invite/accept", async (c) => {
  try {
    const body = await c.req.json();
    const { inviteId, orgId, userId, userEmail } = body;
    
    const now = new Date().toISOString();
    
    // Load invite
    const invite = await kv.get(`org:${orgId}:invite:${inviteId}`);
    
    if (!invite) {
      return c.json({ success: false, error: "Invite not found" }, 404);
    }
    
    // Mark invite as accepted
    invite.status = "accepted";
    invite.acceptedBy = userId;
    invite.acceptedAt = now;
    invite.version = (invite.version || 0) + 1;
    
    await kv.set(`org:${orgId}:invite:${inviteId}`, invite);
    
    // Add user to org members
    const members = await kv.get(`org:${orgId}:members`) || {};
    members[userId] = {
      role: invite.role,
      status: "active",
      addedAt: now,
    };
    
    await kv.set(`org:${orgId}:members`, members);
    
    // Update user's org index
    const orgIndex = await kv.get(`user:${userId}:orgs`) || { orgIds: [], activeOrgId: null };
    const updatedOrgIds = Array.from(new Set([...orgIndex.orgIds, orgId]));
    
    await kv.set(`user:${userId}:orgs`, {
      orgIds: updatedOrgIds,
      activeOrgId: orgId,
    });
    
    return c.json({ success: true, data: { invite, members } });
  } catch (error) {
    console.error("Error accepting invite:", error);
    return c.json({ success: false, error: "Failed to accept invite" }, 500);
  }
});

// Revoke invite
app.post("/make-server-9c2c6866/invite/revoke", async (c) => {
  try {
    const body = await c.req.json();
    const { inviteId, orgId } = body;
    
    const invite = await kv.get(`org:${orgId}:invite:${inviteId}`);
    
    if (!invite) {
      return c.json({ success: false, error: "Invite not found" }, 404);
    }
    
    invite.status = "revoked";
    invite.revokedAt = new Date().toISOString();
    invite.version = (invite.version || 0) + 1;
    
    await kv.set(`org:${orgId}:invite:${inviteId}`, invite);
    
    return c.json({ success: true, data: invite });
  } catch (error) {
    console.error("Error revoking invite:", error);
    return c.json({ success: false, error: "Failed to revoke invite" }, 500);
  }
});

// ============================================
// TASKS ENDPOINTS
// ============================================

// Get all tasks for org
app.get("/make-server-9c2c6866/org/tasks/:orgId", async (c) => {
  try {
    const orgId = c.req.param("orgId");
    const tasksIndex = await kv.get(`org:${orgId}:tasks:index`) || { taskIds: [] };
    
    const tasks = [];
    for (const taskId of tasksIndex.taskIds) {
      const task = await kv.get(`org:${orgId}:task:${taskId}`);
      if (task) {
        tasks.push(task);
      }
    }
    
    return c.json({ success: true, data: tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return c.json({ success: false, error: "Failed to fetch tasks" }, 500);
  }
});

// Create task
app.post("/make-server-9c2c6866/org/tasks", async (c) => {
  try {
    const body = await c.req.json();
    const { orgId, taskId, task } = body;
    
    // Write task
    await kv.set(`org:${orgId}:task:${taskId}`, task);
    
    // Update tasks index
    const tasksIndex = await kv.get(`org:${orgId}:tasks:index`) || { taskIds: [], version: 0 };
    if (!tasksIndex.taskIds.includes(taskId)) {
      tasksIndex.taskIds.push(taskId);
      tasksIndex.version = (tasksIndex.version || 0) + 1;
      await kv.set(`org:${orgId}:tasks:index`, tasksIndex);
    }
    
    return c.json({ success: true, data: task });
  } catch (error) {
    console.error("Error creating task:", error);
    return c.json({ success: false, error: "Failed to create task" }, 500);
  }
});

// Update task
app.put("/make-server-9c2c6866/org/tasks/:taskId", async (c) => {
  try {
    const taskId = c.req.param("taskId");
    const body = await c.req.json();
    const { orgId, task } = body;
    
    await kv.set(`org:${orgId}:task:${taskId}`, task);
    
    return c.json({ success: true, data: task });
  } catch (error) {
    console.error("Error updating task:", error);
    return c.json({ success: false, error: "Failed to update task" }, 500);
  }
});

// Delete task
app.delete("/make-server-9c2c6866/org/tasks/:taskId", async (c) => {
  try {
    const taskId = c.req.param("taskId");
    const body = await c.req.json();
    const { orgId } = body;
    
    // Remove from index
    const tasksIndex = await kv.get(`org:${orgId}:tasks:index`) || { taskIds: [], version: 0 };
    tasksIndex.taskIds = tasksIndex.taskIds.filter(id => id !== taskId);
    tasksIndex.version = (tasksIndex.version || 0) + 1;
    await kv.set(`org:${orgId}:tasks:index`, tasksIndex);
    
    // Delete task (or mark as deleted)
    await kv.del(`org:${orgId}:task:${taskId}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting task:", error);
    return c.json({ success: false, error: "Failed to delete task" }, 500);
  }
});

// ============================================
// RECORDS ENDPOINTS
// ============================================

// Get all records for org
app.get("/make-server-9c2c6866/org/records/:orgId", async (c) => {
  try {
    const orgId = c.req.param("orgId");
    const recordsIndex = await kv.get(`org:${orgId}:records:index`) || { recordIds: [] };
    
    const records = [];
    for (const recordId of recordsIndex.recordIds) {
      const record = await kv.get(`org:${orgId}:record:${recordId}`);
      if (record) {
        records.push(record);
      }
    }
    
    return c.json({ success: true, data: records });
  } catch (error) {
    console.error("Error fetching records:", error);
    return c.json({ success: false, error: "Failed to fetch records" }, 500);
  }
});

// Create record
app.post("/make-server-9c2c6866/org/records", async (c) => {
  try {
    const body = await c.req.json();
    const { orgId, recordId, record } = body;
    
    // Write record
    await kv.set(`org:${orgId}:record:${recordId}`, record);
    
    // Update records index
    const recordsIndex = await kv.get(`org:${orgId}:records:index`) || { recordIds: [], version: 0 };
    if (!recordsIndex.recordIds.includes(recordId)) {
      recordsIndex.recordIds.push(recordId);
      recordsIndex.version = (recordsIndex.version || 0) + 1;
      await kv.set(`org:${orgId}:records:index`, recordsIndex);
    }
    
    return c.json({ success: true, data: record });
  } catch (error) {
    console.error("Error creating record:", error);
    return c.json({ success: false, error: "Failed to create record" }, 500);
  }
});

// Update record
app.put("/make-server-9c2c6866/org/records/:recordId", async (c) => {
  try {
    const recordId = c.req.param("recordId");
    const body = await c.req.json();
    const { orgId, record } = body;
    
    await kv.set(`org:${orgId}:record:${recordId}`, record);
    
    return c.json({ success: true, data: record });
  } catch (error) {
    console.error("Error updating record:", error);
    return c.json({ success: false, error: "Failed to update record" }, 500);
  }
});

// Delete record
app.delete("/make-server-9c2c6866/org/records/:recordId", async (c) => {
  try {
    const recordId = c.req.param("recordId");
    const body = await c.req.json();
    const { orgId } = body;
    
    // Remove from index
    const recordsIndex = await kv.get(`org:${orgId}:records:index`) || { recordIds: [], version: 0 };
    recordsIndex.recordIds = recordsIndex.recordIds.filter(id => id !== recordId);
    recordsIndex.version = (recordsIndex.version || 0) + 1;
    await kv.set(`org:${orgId}:records:index`, recordsIndex);
    
    // Delete record
    await kv.del(`org:${orgId}:record:${recordId}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting record:", error);
    return c.json({ success: false, error: "Failed to delete record" }, 500);
  }
});

// ============================================
// AUDIT LOG ENDPOINTS
// ============================================

// Append to audit log
app.post("/make-server-9c2c6866/org/audit/append", async (c) => {
  try {
    const body = await c.req.json();
    const { orgId, monthKey, entry } = body;
    
    const auditKey = `org:${orgId}:audit:${monthKey}`;
    const auditLog = await kv.get(auditKey) || { entries: [], version: 0 };
    
    // Add entry
    auditLog.entries.push(entry);
    
    // Keep only last 500 entries to avoid huge blobs
    if (auditLog.entries.length > 500) {
      auditLog.entries = auditLog.entries.slice(-500);
    }
    
    auditLog.version = (auditLog.version || 0) + 1;
    
    await kv.set(auditKey, auditLog);
    
    return c.json({ success: true });
  } catch (error) {
    console.error("Error appending to audit log:", error);
    return c.json({ success: false, error: "Failed to append to audit log" }, 500);
  }
});

// Get audit log for month
app.get("/make-server-9c2c6866/org/audit/:orgId/:monthKey", async (c) => {
  try {
    const orgId = c.req.param("orgId");
    const monthKey = c.req.param("monthKey");
    
    const auditLog = await kv.get(`org:${orgId}:audit:${monthKey}`) || { entries: [] };
    
    return c.json({ success: true, data: auditLog.entries });
  } catch (error) {
    console.error("Error fetching audit log:", error);
    return c.json({ success: false, error: "Failed to fetch audit log" }, 500);
  }
});

// Get recent audit logs (last 3 months)
app.get("/make-server-9c2c6866/org/audit/:orgId", async (c) => {
  try {
    const orgId = c.req.param("orgId");
    
    const now = new Date();
    const allEntries = [];
    
    // Get last 3 months
    for (let i = 0; i < 3; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const auditLog = await kv.get(`org:${orgId}:audit:${monthKey}`);
      
      if (auditLog && auditLog.entries) {
        allEntries.push(...auditLog.entries);
      }
    }
    
    // Sort by timestamp descending
    allEntries.sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime());
    
    return c.json({ success: true, data: allEntries });
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    return c.json({ success: false, error: "Failed to fetch audit logs" }, 500);
  }
});

// ============================================
// USER DATA ENDPOINTS (Persistent)
// ============================================

// Save user watchlist
app.post("/make-server-9c2c6866/user/watchlist", async (c) => {
  try {
    const body = await c.req.json();
    const { userId, watchlist } = body;
    await kv.set(`user-watchlist-${userId}`, watchlist);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error saving watchlist:", error);
    return c.json({ success: false, error: "Failed to save watchlist" }, 500);
  }
});

// Get user watchlist
app.get("/make-server-9c2c6866/user/watchlist/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const watchlist = await kv.get(`user-watchlist-${userId}`);
    return c.json({ success: true, data: watchlist || [] });
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    return c.json({ success: false, error: "Failed to fetch watchlist" }, 500);
  }
});

// Save generated brief
app.post("/make-server-9c2c6866/user/briefs", async (c) => {
  try {
    const body = await c.req.json();
    const { userId, brief } = body;
    const briefId = `brief-${userId}-${Date.now()}`;
    await kv.set(briefId, { ...brief, id: briefId, createdAt: new Date().toISOString() });
    return c.json({ success: true, briefId });
  } catch (error) {
    console.error("Error saving brief:", error);
    return c.json({ success: false, error: "Failed to save brief" }, 500);
  }
});

// Get user briefs
app.get("/make-server-9c2c6866/user/briefs/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const briefs = await kv.getByPrefix(`brief-${userId}-`);
    return c.json({ success: true, data: briefs });
  } catch (error) {
    console.error("Error fetching briefs:", error);
    return c.json({ success: false, error: "Failed to fetch briefs" }, 500);
  }
});

// ============================================
// INITIALIZATION ENDPOINT
// ============================================

// Initialize/seed database with mock data
app.post("/make-server-9c2c6866/admin/seed-data", async (c) => {
  try {
    const body = await c.req.json();
    const { dataType, data } = body;
    
    // Validate that data is not null or undefined
    if (data === null || data === undefined) {
      console.error(`Attempted to seed ${dataType} with null/undefined data`);
      return c.json({ success: false, error: `Data for ${dataType} is null or undefined` }, 400);
    }
    
    await kv.set(dataType, data);
    
    return c.json({ success: true, message: `Seeded ${dataType}` });
  } catch (error) {
    console.error("Error seeding data:", error);
    return c.json({ success: false, error: `Failed to seed data: ${error.message}` }, 500);
  }
});

Deno.serve(app.fetch);