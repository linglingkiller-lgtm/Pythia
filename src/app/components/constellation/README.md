# Constellation - Stakeholder Intelligence Network

## Overview

The Constellation feature is Revere's comprehensive stakeholder relationship mapping and intelligence system. It provides visual network analysis, path finding, influence scoring, and client reporting capabilities for government affairs professionals.

## Component Architecture

### Main Components

#### `ConstellationPage.tsx` (Main Container)
- **Location**: `/src/app/pages/ConstellationPage.tsx`
- **Purpose**: Primary page component that orchestrates all Constellation features
- **Key Features**:
  - Network visualization container
  - State management for selected nodes, filters, and UI modes
  - Integration point for all sub-components
  - Graph interaction handlers (zoom, pan, node selection)

#### `NetworkVisualization.tsx`
- **Purpose**: Interactive force-directed network graph
- **Library**: `react-force-graph-2d`
- **Features**:
  - Multi-layer node rendering (bills, legislators, clients, etc.)
  - Relationship edge rendering with sentiment colors
  - Physics-based layout simulation
  - Zoom/pan/drag interactions
  - Node hover states and tooltips
  - Path highlighting

#### `NetworkControls.tsx`
- **Purpose**: Filter and layout control panel
- **Features**:
  - Entity type toggles (bills/legislators/clients/etc.)
  - Relationship type filters (sponsor/support/oppose)
  - Influence score sliders
  - Layout algorithm switcher (force/hierarchical/circular/etc.)
  - Search functionality
  - Time range selector
  - View mode toggles

#### `NodeDetailPanel.tsx`
- **Purpose**: Right sidebar showing selected entity details
- **Features**:
  - Entity profile information
  - Relationship list with scores
  - Interaction history timeline
  - Action buttons (find path, add to report, create task)
  - Contact information
  - Recent activity feed

#### `PathFinderModal.tsx`
- **Purpose**: Intelligent path discovery tool
- **Features**:
  - "Find path to..." functionality
  - Multiple path options with success probabilities
  - Path visualization and comparison
  - Recommended actions for each path
  - Intermediate connection details
  - Export path to report

#### `ReportGenerator.tsx`
- **Purpose**: Client report creation and export
- **Features**:
  - Multiple report templates
    - Executive Stakeholder Brief
    - Deep Relationship Audit
    - Coalition Opportunity Report
    - Weekly Intelligence Brief
  - PDF generation
  - Web dashboard export
  - Customization options (branding, sections, filters)
  - Template library
  - Preview functionality

#### `NetworkAnalytics.tsx`
- **Purpose**: Network health and metrics dashboard
- **Features**:
  - Network density metrics
  - Clustering coefficient
  - Average path length
  - Health score (0-100)
  - Relationship distribution charts
  - Influence centrality analysis
  - Gap detection alerts
  - Trend visualization

#### `ScenarioBuilder.tsx`
- **Purpose**: What-if scenario modeling tool
- **Features**:
  - Scenario creation ("What if we lose X's support?")
  - Network impact simulation
  - Before/after comparison
  - Risk assessment
  - Alternative path suggestions
  - Coalition strength recalculation
  - Export scenario analysis

## Data Model

### Core Types

```typescript
// Network Node
interface NetworkNode {
  id: string;
  type: 'bill' | 'legislator' | 'client' | 'committee' | 'issue' | 'stakeholder' | 'staff';
  label: string;
  metadata: {
    name?: string;
    party?: string;
    district?: string;
    photoUrl?: string;
    // ... additional fields
  };
  influenceScore: number;
  lastUpdated: Date;
}

// Network Edge (Relationship)
interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  type: 'sponsor' | 'cosponsor' | 'support' | 'oppose' | 'neutral' | 'client' | 'staff' | 'committee';
  weight: number; // 1-10
  sentiment: 'positive' | 'negative' | 'neutral';
  interactionHistory: Interaction[];
}

// Path Result
interface PathResult {
  path: string[];
  score: number;
  length: number;
  estimatedTimeline: string;
  recommendations: string[];
}
```

## Demo Data

**Location**: `/src/app/data/constellationData.ts`

### Includes:
- **25+ nodes**: Diverse entity types across the network
- **31 edges**: Rich relationship data with interaction history
- **3 clients**: Desert Solar Coalition, Arizona Tech Alliance
- **3 bills**: Solar Standards, Data Privacy, Clean Energy Tax
- **6 legislators**: Mix of House/Senate, Democrat/Republican
- **2 committees**: Energy, Technology
- **3 issues**: Clean Energy, Data Privacy, Tax Policy
- **3 stakeholders**: Industry associations and advocacy groups
- **3 staff**: Chiefs of Staff and Policy Directors

### Sample Relationships:
- Client → Legislator (direct advocacy relationships)
- Legislator → Bill (sponsorship, support, opposition)
- Legislator → Committee (membership)
- Bill → Issue (topic classification)
- Stakeholder → Bill (coalition support/opposition)
- Staff → Legislator (employment relationship)

## Key Features

### 1. Visual Intelligence
- **Force-directed layout**: Organically positions nodes based on relationships
- **Multi-layer architecture**: 7 distinct node types with unique styling
- **Sentiment visualization**: Edge colors indicate positive/negative/neutral
- **Influence sizing**: Node size correlates with influence score
- **Animated interactions**: Pulse effects for recent activity

### 2. Path Finding
- **Dijkstra's algorithm**: Finds optimal routes between entities
- **Multi-path discovery**: Shows top 5 paths with success probabilities
- **Success scoring**: Multi-factor analysis (relationship strength, recency, alignment)
- **Actionable recommendations**: Specific next steps for each path
- **Visual path highlighting**: See the route on the network graph

### 3. Relationship Intelligence
- **Automated scoring**: Multi-factor relationship strength calculation
- **Interaction tracking**: Full history of meetings, calls, emails, events
- **Sentiment analysis**: Track relationship tone over time
- **Frequency metrics**: Monitor engagement cadence
- **Gap detection**: Identify under-connected entities

### 4. Network Analytics
- **Health scoring**: Overall network quality assessment (0-100)
- **Density metrics**: Measure interconnectedness
- **Centrality analysis**: Identify key influencers
- **Clustering detection**: Find sub-coalitions
- **Vulnerability assessment**: Identify single points of failure

### 5. Scenario Modeling
- **What-if analysis**: Simulate network changes
- **Impact forecasting**: Predict coalition outcomes
- **Risk identification**: Find vulnerabilities
- **Path redundancy**: Ensure backup routes exist
- **Coalition expansion**: Model new partnership effects

### 6. Client Reporting
- **Professional PDFs**: Client-ready formatted reports
- **Custom branding**: Add client logos and colors
- **Multiple templates**: Executive brief, deep audit, coalition analysis
- **Interactive exports**: Web dashboards with live updates
- **Automated scheduling**: Weekly intelligence briefs

## Integration Points

### Existing Revere Data
- **Bills**: Links to `/src/app/data/billsData.ts`
- **Legislators**: Links to `/src/app/data/legislatorData.ts`  
- **Clients**: Links to `/src/app/data/clientsData.ts`
- **Calendar**: Future integration for interaction tracking

### Navigation
- **Sidebar**: Constellation entry with Network icon
- **Theme**: Deep violet/indigo color scheme
- **Badge**: "Beta" indicator for new feature
- **Routing**: Integrated into main App.tsx routing

### Cross-Platform Features
- **Ask Pythia**: Can query stakeholder network
- **Smart Structuring**: Extract relationships from documents
- **Calendar**: Meeting history populates interactions
- **Tasks**: Create follow-up actions from paths

## Usage Patterns

### Typical Workflow

1. **Explore the Network**
   - Open Constellation page
   - Use controls to filter and focus
   - Identify key relationships visually

2. **Find a Path**
   - Right-click target legislator
   - Select "Find Path To..."
   - Review path options with success scores
   - Choose optimal route

3. **Analyze Network Health**
   - Open Analytics panel
   - Review health score and metrics
   - Identify gaps and vulnerabilities
   - Take recommended actions

4. **Model a Scenario**
   - Open Scenario Builder
   - Select "What if..." condition
   - Review impact analysis
   - Export for team discussion

5. **Generate Report**
   - Click "Generate Report"
   - Choose template
   - Customize sections and branding
   - Export PDF or web dashboard
   - Send to client

### Advanced Workflows

**Coalition Building**
1. Filter to show undecided legislators
2. Find paths to each via existing relationships
3. Model coalition with/without key members
4. Generate Coalition Opportunity Report
5. Assign outreach tasks to team

**Crisis Response**
1. Receive alert about lost supporter
2. Run scenario: "What if Sen. X opposes?"
3. Find alternative paths to decision-makers
4. Assess network health impact
5. Generate crisis response brief
6. Execute backup engagement plan

**Quarterly Review**
1. Set time range to last 90 days
2. Review relationship score changes
3. Identify neglected connections
4. Find new path opportunities
5. Generate Executive Stakeholder Brief
6. Present to client with recommendations

## Performance Considerations

### Optimization Strategies
- **Lazy loading**: Page loads on-demand
- **Memoization**: Expensive calculations cached
- **Virtual rendering**: Only render visible nodes
- **Efficient updates**: Minimal re-renders on filter changes
- **Web workers**: Path-finding runs in background (future)

### Scalability Limits
- **Recommended max nodes**: 100-150 for smooth performance
- **Recommended max edges**: 300-500 relationships
- **Large networks**: Use aggressive filtering
- **Performance mode**: Disable animations for 200+ nodes

## Future Enhancements

### Planned Features
- [ ] Real-time collaboration (multi-user editing)
- [ ] CRM integration (Salesforce, HubSpot)
- [ ] Calendar auto-sync (Google, Outlook)
- [ ] Email tracking integration
- [ ] Social media network overlay (LinkedIn)
- [ ] Campaign finance data integration
- [ ] Mobile app for field access
- [ ] Voice search and commands
- [ ] AI-powered recommendations
- [ ] Predictive coalition modeling

### Community Requests
- [ ] Geospatial layout mode (map-based)
- [ ] 3D network visualization
- [ ] VR/AR stakeholder exploration
- [ ] Automated relationship scoring from emails
- [ ] Competitive intelligence layer
- [ ] Historical network playback animation
- [ ] Export to Gephi/NodeXL

## Development Notes

### Local Development
```bash
# All dependencies already installed
npm run dev

# Navigate to Constellation in sidebar
# Demo data auto-loads
```

### Adding New Node Types
1. Update `NetworkNode` type in `constellationData.ts`
2. Add node rendering logic in `NetworkVisualization.tsx`
3. Update filter controls in `NetworkControls.tsx`
4. Add detail panel template in `NodeDetailPanel.tsx`

### Adding New Report Templates
1. Define template in `ReportGenerator.tsx`
2. Add to template dropdown
3. Create PDF layout logic
4. Test export functionality

### Debugging
- Use browser DevTools for graph rendering
- Check console for path-finding logs
- Monitor network panel for data loading
- Use React DevTools for component state

## Credits

**Design Philosophy**: "Map the stars of influence"  
**Inspiration**: Network science, social network analysis, coalition theory  
**Libraries**: react-force-graph-2d, d3-force  
**Theme**: Constellation/night sky aesthetic  

---

*Part of the Revere Intelligence Platform*  
*"Illuminate the advocacy landscape"*
