// src/components/TagInput.tsx
import { Badge, Input, Button } from "@/components/ui";
import { X, Plus } from "lucide-react";

interface Props {
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
}

export function TagInput({ tags, onAdd, onRemove }: Props) {
  const [value, setValue] = useState("");
  const handleAdd = () => {
    const t = value.trim();
    if (t && !tags.includes(t)) {
      onAdd(t);
      setValue("");
    }
  };

  return (
    <>
      <div className="flex space-x-2">
        <Input
          placeholder="New tag"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyPress={e =>
            e.key === "Enter" && (e.preventDefault(), handleAdd())
          }
        />
        <Button size="sm" onClick={handleAdd}>
          <Plus size={16} />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        {tags.map(tag => (
          <Badge key={tag} variant="secondary" className="flex items-center">
            <span>{tag}</span>
            <button onClick={() => onRemove(tag)} className="ml-1">
              <X size={12} />
            </button>
          </Badge>
        ))}
      </div>
    </>
  );
}
