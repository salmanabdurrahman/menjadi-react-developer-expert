import { Badge, Button } from '@/components/ui';

interface CategoryFilterProps {
  categories: string[];
  onSelect: (category: string) => void;
  selectedCategory: string;
}

export function CategoryFilter({ categories, onSelect, selectedCategory }: CategoryFilterProps) {
  const options = ['all', ...categories];

  return (
    <div aria-label="Filter kategori" className="flex flex-wrap gap-2" role="list">
      {options.map((category) => {
        const isSelected = selectedCategory === category;
        const label = category === 'all' ? 'Semua' : category;

        return (
          <Button
            aria-pressed={isSelected}
            key={category}
            onClick={() => {
              onSelect(category);
            }}
            size="sm"
            type="button"
            variant={isSelected ? 'default' : 'outline'}
          >
            {label}
          </Button>
        );
      })}
      {categories.length === 0 ? (
        <Badge className="self-center" variant="secondary">
          Tidak ada kategori
        </Badge>
      ) : null}
    </div>
  );
}
