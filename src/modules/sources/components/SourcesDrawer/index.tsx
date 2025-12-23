import React from "react";
import { Drawer } from "antd";
import { useSources } from "@/modules/sources/contexts/SourcesContext";
import { useAppStyles } from "@/common/styles/useAppStyles";
import { useSourceHighlight } from "@/modules/sources/hooks/useSourceHighlight";
import { SourceItem } from "@/modules/sources/components/SourceItem";

export const SourcesDrawer: React.FC = () => {
  const { open, activeSourceIndex, closeDrawer, sources } = useSources();
  const { styles } = useAppStyles();
  const { itemRefs, scrollContainerRef } = useSourceHighlight(
    open,
    activeSourceIndex,
    sources
  );

  return (
    <Drawer
      title="参考来源"
      placement="right"
      onClose={closeDrawer}
      open={open}
      width={560}
      className={styles.sourcesDrawer}
    >
      <div className={styles.sourcesDrawerContent} ref={scrollContainerRef}>
        {sources.map((source) => (
          <SourceItem
            key={source.key}
            source={source}
            isActive={activeSourceIndex === source.key}
            onRef={(el) => {
              itemRefs.current[source.key] = el;
            }}
          />
        ))}
      </div>
    </Drawer>
  );
};

