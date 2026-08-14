"use client";

import { motion, AnimatePresence } from "framer-motion";

interface StartButtonContextMenuProps {
  onClose: () => void;
  onSelect: (item: string) => void;
}

interface MenuItem {
  label: string;
  action?: string;
}

interface MenuSection {
  title: string;
  items: ContextMenuItem[];
}

interface Separator {
  type: "separator";
}

type ContextMenuItem = MenuItem | MenuSection | Separator;

interface StartButtonContextMenuProps {
  onClose: () => void;
  onSelect: (item: string) => void;
}

export default function StartButtonContextMenu({ onClose, onSelect }: StartButtonContextMenuProps) {
  const menuItems: ContextMenuItem[] = [
    {
      title: "Creative",
      items: [
        { label: "Paint", action: "paint" },
        { label: "Games", action: "games" },
      ],
    },
    { type: "separator" as const },
    {
      title: "Main",
      items: [
        { label: "Projects", action: "projects" },
        { label: "About Me", action: "about" },
        { type: "separator" as const },
      ],
    },
    {
      title: "Entertainment",
      items: [
        { label: "Video", action: "video" },
        { label: "Music", action: "music" },
      ],
    },
    { type: "separator" as const },
    { label: "Version", action: "version" },
  ];

  const isSeparator = (item: ContextMenuItem): item is Separator => {
    return (item as Separator).type === "separator";
  };

  const isSection = (item: ContextMenuItem): item is MenuSection => {
    return (item as MenuSection).title !== undefined;
  };

  const isMenuItem = (item: ContextMenuItem): item is MenuItem => {
    return (item as MenuItem).label !== undefined;
  };

  const handleItemClick = (action?: string) => {
    if (action) {
      onSelect(action);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed z-[200] w-56 border border-gray-700 left-1/2 -translate-x-1/2"
        style={{
          bottom: 70,
          backgroundColor: "#1a2332",
          borderRadius: 0,
        }}
      >
        <div className="p-1">
          {menuItems.map((item, index) => {
            if (isSeparator(item)) {
              return (
                <div
                  key={`sep-${index}`}
                  className="my-1 border-t border-gray-700"
                />
              );
            }

            if (isSection(item)) {
              return (
                <div key={item.title}>
                  <div className="px-3 py-1">
                    <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                      {item.title}
                    </p>
                  </div>
                  {item.items.map((subItem, subIndex) => {
                    if (isSeparator(subItem)) {
                      return (
                        <div
                          key={`sep-${subIndex}`}
                          className="my-1 border-t border-gray-700"
                        />
                      );
                    }
                    if (isMenuItem(subItem)) {
                      return (
                        <button
                          key={subItem.label}
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={() => handleItemClick(subItem.action)}
                           className="group w-full flex items-center justify-between px-3 py-1.5 text-left bg-transparent hover-accent-bg hover-dark-text transition-colors duration-150"
                         >
                           <span className="text-sm text-gray-200">{subItem.label}</span>
                         </button>
                      );
                    }
                    return null;
                  })}
                </div>
              );
            }

            return (
              <button
                key={item.label}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => handleItemClick(item.action)}
                className="group w-full flex items-center justify-between px-3 py-1.5 text-left bg-transparent hover-accent-bg hover-dark-text transition-colors duration-150"
              >
                <span className="text-sm text-gray-200">{item.label}</span>
              </button>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
