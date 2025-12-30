// KV Store utilities for Data Pulls

import { DataPull, DataPullTemplate } from './types';

const ORG_ID = 'demo-org'; // In production, this would come from auth context

// Generate unique ID
function generateId(): string {
  return `dp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Data Pulls CRUD

export async function createDataPull(pull: Omit<DataPull, 'id' | 'createdAt' | 'updatedAt'>): Promise<DataPull> {
  const id = generateId();
  const now = new Date().toISOString();
  
  const newPull: DataPull = {
    ...pull,
    id,
    orgId: ORG_ID,
    createdAt: now,
    updatedAt: now,
    activity: [
      {
        type: 'created',
        byUserId: pull.requesterUserId,
        byUserName: pull.requesterUserName,
        timestamp: now,
      },
      ...(pull.activity || []),
    ],
  };

  // Save pull
  localStorage.setItem(`org:${ORG_ID}:datapull:${id}`, JSON.stringify(newPull));

  // Update index
  const indexKey = `org:${ORG_ID}:datapulls:index`;
  const indexData = localStorage.getItem(indexKey);
  const index = indexData ? JSON.parse(indexData) : { ids: [] };
  index.ids.unshift(id);
  localStorage.setItem(indexKey, JSON.stringify(index));

  // Update project index if projectId exists
  if (pull.projectId) {
    const projectIndexKey = `org:${ORG_ID}:datapulls:byProject:${pull.projectId}`;
    const projectIndexData = localStorage.getItem(projectIndexKey);
    const projectIndex = projectIndexData ? JSON.parse(projectIndexData) : [];
    projectIndex.unshift(id);
    localStorage.setItem(projectIndexKey, JSON.stringify(projectIndex));
  }

  return newPull;
}

export async function getDataPull(id: string): Promise<DataPull | null> {
  const data = localStorage.getItem(`org:${ORG_ID}:datapull:${id}`);
  return data ? JSON.parse(data) : null;
}

export async function updateDataPull(id: string, updates: Partial<DataPull>): Promise<DataPull | null> {
  const existing = await getDataPull(id);
  if (!existing) return null;

  const updated: DataPull = {
    ...existing,
    ...updates,
    id: existing.id,
    orgId: existing.orgId,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(`org:${ORG_ID}:datapull:${id}`, JSON.stringify(updated));
  return updated;
}

export async function deleteDataPull(id: string): Promise<boolean> {
  const pull = await getDataPull(id);
  if (!pull) return false;

  // Remove from main storage
  localStorage.removeItem(`org:${ORG_ID}:datapull:${id}`);

  // Remove from index
  const indexKey = `org:${ORG_ID}:datapulls:index`;
  const indexData = localStorage.getItem(indexKey);
  if (indexData) {
    const index = JSON.parse(indexData);
    index.ids = index.ids.filter((pullId: string) => pullId !== id);
    localStorage.setItem(indexKey, JSON.stringify(index));
  }

  // Remove from project index
  if (pull.projectId) {
    const projectIndexKey = `org:${ORG_ID}:datapulls:byProject:${pull.projectId}`;
    const projectIndexData = localStorage.getItem(projectIndexKey);
    if (projectIndexData) {
      const projectIndex = JSON.parse(projectIndexData);
      const filtered = projectIndex.filter((pullId: string) => pullId !== id);
      localStorage.setItem(projectIndexKey, JSON.stringify(filtered));
    }
  }

  return true;
}

export async function getAllDataPulls(): Promise<DataPull[]> {
  const indexKey = `org:${ORG_ID}:datapulls:index`;
  const indexData = localStorage.getItem(indexKey);
  if (!indexData) return [];

  const index = JSON.parse(indexData);
  const pulls: DataPull[] = [];

  for (const id of index.ids) {
    const pull = await getDataPull(id);
    if (pull) pulls.push(pull);
  }

  return pulls;
}

export async function getDataPullsByProject(projectId: string): Promise<DataPull[]> {
  const projectIndexKey = `org:${ORG_ID}:datapulls:byProject:${projectId}`;
  const projectIndexData = localStorage.getItem(projectIndexKey);
  if (!projectIndexData) return [];

  const pullIds = JSON.parse(projectIndexData);
  const pulls: DataPull[] = [];

  for (const id of pullIds) {
    const pull = await getDataPull(id);
    if (pull) pulls.push(pull);
  }

  return pulls;
}

export async function addActivityEntry(
  pullId: string,
  entry: Omit<import('./types').ActivityEntry, 'timestamp'>
): Promise<DataPull | null> {
  const pull = await getDataPull(pullId);
  if (!pull) return null;

  const activity = pull.activity || [];
  activity.unshift({
    ...entry,
    timestamp: new Date().toISOString(),
  });

  return updateDataPull(pullId, { activity });
}

// Templates CRUD

export async function createDataPullTemplate(
  template: Omit<DataPullTemplate, 'id' | 'createdAt'>
): Promise<DataPullTemplate> {
  const id = `tpl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date().toISOString();

  const newTemplate: DataPullTemplate = {
    ...template,
    id,
    orgId: ORG_ID,
    createdAt: now,
  };

  localStorage.setItem(`org:${ORG_ID}:datapulltemplate:${id}`, JSON.stringify(newTemplate));

  // Update index
  const indexKey = `org:${ORG_ID}:datapulltemplates:index`;
  const indexData = localStorage.getItem(indexKey);
  const index = indexData ? JSON.parse(indexData) : { ids: [] };
  index.ids.unshift(id);
  localStorage.setItem(indexKey, JSON.stringify(index));

  return newTemplate;
}

export async function getAllDataPullTemplates(): Promise<DataPullTemplate[]> {
  const indexKey = `org:${ORG_ID}:datapulltemplates:index`;
  const indexData = localStorage.getItem(indexKey);
  if (!indexData) return [];

  const index = JSON.parse(indexData);
  const templates: DataPullTemplate[] = [];

  for (const id of index.ids) {
    const data = localStorage.getItem(`org:${ORG_ID}:datapulltemplate:${id}`);
    if (data) templates.push(JSON.parse(data));
  }

  return templates;
}

export async function deleteDataPullTemplate(id: string): Promise<boolean> {
  localStorage.removeItem(`org:${ORG_ID}:datapulltemplate:${id}`);

  const indexKey = `org:${ORG_ID}:datapulltemplates:index`;
  const indexData = localStorage.getItem(indexKey);
  if (indexData) {
    const index = JSON.parse(indexData);
    index.ids = index.ids.filter((tplId: string) => tplId !== id);
    localStorage.setItem(indexKey, JSON.stringify(index));
  }

  return true;
}

// Utility: Generate plain-English summary of criteria
export function generateCriteriaSummary(pull: DataPull): string {
  const parts: string[] = [];

  if (pull.criteria.partisanshipModel) {
    parts.push(pull.criteria.partisanshipModel);
  }

  if (pull.criteria.pvfSegment) {
    parts.push(`PVF ${pull.criteria.pvfSegment}`);
  }

  if (pull.criteria.turnoutRule) {
    parts.push(pull.criteria.turnoutRule);
  }

  if (pull.criteria.religionTag) {
    parts.push(pull.criteria.religionTag);
  }

  if (pull.geography.mode === 'statewide') {
    parts.push(`statewide in ${pull.state}`);
  } else if (pull.geography.mode === 'counties' && pull.geography.counties) {
    parts.push(`in ${pull.geography.counties.join(' + ')}`);
  }

  if (pull.criteria.ageRange?.min || pull.criteria.ageRange?.max) {
    const min = pull.criteria.ageRange.min || '?';
    const max = pull.criteria.ageRange.max || '?';
    parts.push(`age ${min}-${max}`);
  }

  if (pull.criteria.exclusions && pull.criteria.exclusions.length > 0) {
    parts.push(`excluding ${pull.criteria.exclusions.join(', ')}`);
  }

  if (pull.criteria.outputPrefs?.hhRollups) {
    parts.push('with HH rollups');
  }

  return parts.join(', ') || 'No criteria specified';
}
