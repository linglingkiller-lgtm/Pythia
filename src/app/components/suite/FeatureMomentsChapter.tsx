import React from 'react';
import { FeatureMoment } from './FeatureMoment';
import { SectionDivider } from './SectionDivider';
import { AskPythiaMock } from './mocks/AskPythiaMock';
import { SmartStructuringMock } from './mocks/SmartStructuringMock';
import { WarRoomMock } from './mocks/WarRoomMock';
import { BillsIntelligenceMock } from './mocks/BillsIntelligenceMock';
import { DoorPaceMock } from './mocks/DoorPaceMock';

export function FeatureMomentsChapter() {
  return (
    <div className="py-32 space-y-32">
      {/* Moment A: Ask Pythia */}
      <FeatureMoment
        id="ask-pythia"
        headline="Ask the system. Get answers you can act on."
        support="Instant clarity across bills, clients, projects, and records—grounded in your work, not guesses."
        mockComponent={<AskPythiaMock />}
      />

      <SectionDivider />

      {/* Moment B: Smart Structuring */}
      <FeatureMoment
        id="smart-structuring"
        headline="Turn messy notes into structured work."
        support="Paste a meeting note. Pythia extracts action items, owners, due dates, and next steps—ready to ship."
        mockComponent={<SmartStructuringMock />}
      />

      <SectionDivider />

      {/* Moment C: War Room */}
      <FeatureMoment
        id="war-room"
        headline="A live command center for what matters now."
        support="Projects, risks, and recommended actions—always current, always prioritized."
        mockComponent={<WarRoomMock />}
      />

      <SectionDivider />

      {/* Moment D: Bills Intelligence */}
      <FeatureMoment
        id="bills-intelligence"
        headline="Bills, decoded. Changes, tracked. Strategy, suggested."
        support="Understand the bill in minutes—then move with confidence."
        mockComponent={<BillsIntelligenceMock />}
      />

      <SectionDivider />

      {/* Moment E: Door Pace */}
      <FeatureMoment
        id="door-pace"
        headline="Pace to goal, in one glance."
        support="Doors knocked, doors remaining, days left, staffing coverage—plus a projected finish line."
        mockComponent={<DoorPaceMock />}
      />
    </div>
  );
}