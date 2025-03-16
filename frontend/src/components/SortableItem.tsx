import React from "react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

interface List {
    id?: number,
    task_name: string,
    content: string,
    due_date: any,
    priority: number,
  }

const SortableItem  = ({ id, content }: {id: number, content: List}) => {
      const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
      } = useSortable({ id });
    
      const style = {
        transform: CSS.Transform.toString(transform),
        transition,
      };

      const options: Intl.DateTimeFormatOptions = { 
        year: "numeric", 
        month: "long", 
        day: "numeric" 
      };

    
      return (
        <div
          ref={setNodeRef}
          style={style}
          className="sortable-item"
          {...attributes}
          {...listeners}
        >
          <p>{content.task_name}</p>
          <p>{content.content}</p>
          <p>Due: {new Date(content.due_date).toLocaleDateString("en-US", options)}</p>
        </div>
      );
  };


export default SortableItem;