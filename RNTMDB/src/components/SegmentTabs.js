import React from "react";

import { Segment, SegmentRow, SegmentText } from "../styles";

/**
 * Abas da tela de CARDS (Destaques / Quero assistir / Assistidos / Favoritos).
 * Recebe a lista de segmentos e avisa a tela qual foi escolhido.
 */
const SegmentTabs = ({ segments, active, onChange }) => (
  <SegmentRow>
    {segments.map((segment) => {
      const isActive = active === segment.key;

      return (
        <Segment
          key={segment.key}
          $active={isActive}
          onPress={() => onChange(segment.key)}
        >
          <SegmentText $active={isActive}>{segment.label}</SegmentText>
        </Segment>
      );
    })}
  </SegmentRow>
);

export default SegmentTabs;
