"use client";

import { Category } from "@prisma/client";
import { IconType } from "react-icons";
import {
  FcEngineering,
  FcFilmReel,
  FcMultipleDevices,
  FcMusic,
  FcOldTimeCamera,
  FcReadingEbook,
  FcSalesPerformance,
  FcSportsMode,
  FcTemplate,
} from "react-icons/fc";
import CategoryItem from "./category-item";

interface CategoriesProps {
  items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
  Art: FcOldTimeCamera,
  Business: FcSalesPerformance,
  Education: FcReadingEbook,
  Entertainment: FcFilmReel,
  Music: FcMusic,
  Photography: FcOldTimeCamera,
  Programming: FcMultipleDevices,
  Sports: FcSportsMode,
  Engineering: FcEngineering,
};

const Categories = ({ items }: CategoriesProps) => {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      {items.map((item) => (
        <CategoryItem
          key={item.id}
          label={item.name}
          icon={iconMap[item.name] || FcTemplate}
          value={item.id}
        />
      ))}
    </div>
  );
};

export default Categories;
