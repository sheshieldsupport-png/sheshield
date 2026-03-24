import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Phone, Trash2, UserPlus, Users } from "lucide-react";
import { useState } from "react";
import { useApp } from "../context/AppContext";
import type { EmergencyContact } from "../types/app";

export default function ContactsScreen() {
  const { contacts, setContacts, setScreen } = useApp();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [rel, setRel] = useState<EmergencyContact["relationship"]>("Family");

  function handleAdd() {
    if (!name.trim() || !phone.trim()) return;
    setContacts([
      ...contacts,
      { id: Date.now().toString(), name, phone, relationship: rel },
    ]);
    setName("");
    setPhone("");
    setRel("Family");
  }

  function handleDelete(id: string) {
    setContacts(contacts.filter((c) => c.id !== id));
  }

  const relColors: Record<string, string> = {
    Family: "oklch(0.58 0.25 340)",
    Friend: "oklch(0.55 0.18 145)",
    Other: "oklch(0.60 0.15 250)",
  };

  return (
    <div className="flex flex-col gap-5 pb-4 animate-slide-up">
      <div className="flex items-center gap-3">
        <button
          type="button"
          data-ocid="contacts.back.button"
          onClick={() => setScreen("home")}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="font-display text-xl font-bold">Emergency Contacts</h2>
          <p className="text-xs text-muted-foreground">
            Alerted automatically in emergencies
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {contacts.length === 0 && (
          <div
            data-ocid="contacts.list.empty_state"
            className="text-center py-8 text-muted-foreground text-sm"
          >
            <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
            No emergency contacts added yet.
          </div>
        )}
        {contacts.map((c, i) => (
          <div
            key={c.id}
            data-ocid={`contacts.contact.item.${i + 1}`}
            className="flex items-center gap-3 rounded-xl border p-3.5"
            style={{
              background: "oklch(1 0 0)",
              borderColor: "oklch(0.88 0.005 265)",
              boxShadow: "0 1px 3px oklch(0 0 0 / 0.05)",
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold"
              style={{
                background: "oklch(0.94 0.005 265)",
                color: relColors[c.relationship],
              }}
            >
              {c.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{c.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {c.phone}
                </span>
                <span
                  className="text-xs font-medium"
                  style={{ color: relColors[c.relationship] }}
                >
                  • {c.relationship}
                </span>
              </div>
            </div>
            <button
              type="button"
              data-ocid={`contacts.contact.delete_button.${i + 1}`}
              onClick={() => handleDelete(c.id)}
              className="p-2 rounded-lg hover:bg-muted transition-colors opacity-50 hover:opacity-100"
            >
              <Trash2
                className="w-4 h-4"
                style={{ color: "oklch(0.58 0.25 340)" }}
              />
            </button>
          </div>
        ))}
      </div>

      <div
        className="rounded-2xl border p-4 space-y-3"
        style={{
          background: "oklch(1 0 0)",
          borderColor: "oklch(0.88 0.005 265)",
          boxShadow: "0 1px 6px oklch(0 0 0 / 0.06)",
        }}
      >
        <h3 className="font-display font-semibold text-sm flex items-center gap-2">
          <UserPlus
            className="w-4 h-4"
            style={{ color: "oklch(0.58 0.25 340)" }}
          />
          Add New Contact
        </h3>
        <div className="space-y-2">
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">
              Full Name
            </Label>
            <Input
              data-ocid="contacts.name.input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Meera Singh"
              className="h-10 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">
              Phone Number
            </Label>
            <Input
              data-ocid="contacts.phone.input"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit mobile number"
              className="h-10 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">
              Relationship
            </Label>
            <Select
              value={rel}
              onValueChange={(v) =>
                setRel(v as EmergencyContact["relationship"])
              }
            >
              <SelectTrigger
                data-ocid="contacts.relationship.select"
                className="h-10 text-sm"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Family">Family</SelectItem>
                <SelectItem value="Friend">Friend</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button
          data-ocid="contacts.add.submit_button"
          onClick={handleAdd}
          disabled={!name.trim() || !phone.trim()}
          className="w-full h-10 font-semibold text-sm"
          style={{ background: "oklch(0.58 0.25 340)" }}
        >
          <UserPlus className="w-4 h-4 mr-2" /> Add Contact
        </Button>
      </div>
    </div>
  );
}
