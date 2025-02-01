import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface WordListAddButtonProps {
  onOpen: () => void;
  className?: string;
}

const WordListAddButton: React.FC<WordListAddButtonProps> = ({
  onOpen,
  className = "",
}) => {
  return (
    <div
      role="button"
      className={`cursor-pointer ${className}`}
      onClick={onOpen}
    >
      <PlusCircle className="transition-all duration-300 ease-in-out hover:scale-125" />
    </div>
  );
};

const WordListAddDialog = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const create = useMutation(api.wordLists.create);

  const [name, setName] = useState("");

  const [mode, setMode] = useState<"definition" | "meaning">("meaning");

  const onSubmit = async () => {
    if (!name) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const promise = create({ name, mode });
      toast.promise(promise, {
        loading: "Creating word list...",
        success: "Word list created successfully!",
        error: "Failed to create word list.",
      });
      onClose(); // Close dialog after success
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">
            Create a new word list
          </h2>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter word list name"
            />
          </div>

          <div>
            <Label>Mode</Label>
            <Select
              value={mode}
              onValueChange={(value) => setMode(value as "definition" | "meaning")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="definition">Definition</SelectItem>
                <SelectItem value="meaning">Meaning</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={onSubmit} className="w-full">
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const WordListAdd = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <WordListAddButton onOpen={() => setIsOpen(true)} />
      <WordListAddDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default WordListAdd;
