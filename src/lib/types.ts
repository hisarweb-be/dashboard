export interface Organization {
  id: string;
  name: string;
  domain: string;
  industry: string;
  country: string;
  city: string;
  employeeCount: number;
  icpScore: number;
  source: string;
  status: string;
  prospects: Prospect[];
  createdAt: string;
  updatedAt: string;
}

export interface Prospect {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  organizationId: string;
  organizationName: string;
  leadScore: number;
  status: string;
  language: string;
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsOverview {
  totalOrganizations: number;
  totalProspects: number;
  averageIcpScore: number;
  pipeline: Record<string, number>;
  recentActivity: {
    date: string;
    action: string;
    details: string;
  }[];
}

export interface AuditEntry {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  timestamp: string;
}

export interface ApprovalItem {
  id: string;
  type: string;
  action: string;
  entityType: string;
  entityId: string;
  entityName: string;
  details: Record<string, unknown>;
  status: string;
  createdAt: string;
}
