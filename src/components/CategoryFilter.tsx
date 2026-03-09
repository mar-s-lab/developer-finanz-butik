import { Button } from "@/components/ui/button";

const CATEGORIES = [
  { value: "", label: "All" },
  { value: "legal", label: "Legal" },
  { value: "accounting", label: "Accounting" },
  { value: "consulting", label: "Consulting" },
  { value: "marketing", label: "Marketing" },
  { value: "technology", label: "Technology" },
  { value: "construction", label: "Construction" },
  { value: "real_estate", label: "Real Estate" },
  { value: "other", label: "Other" },
];

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function CategoryFilter({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((cat) => (
        <Button
          key={cat.value}
          size="sm"
          variant={value === cat.value ? "default" : "outline"}
          onClick={() => onChange(cat.value)}
        >
          {cat.label}
        </Button>
      ))}
    </div>
  );
}
