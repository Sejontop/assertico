"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { KeyValueEditor } from "@/components/request/key-value-editor";
import type { BodyType, KeyValuePair } from "@/types";

interface BodyEditorProps {
  bodyType: BodyType;
  onBodyTypeChange: (type: BodyType) => void;
  bodyText: string;
  onBodyTextChange: (value: string) => void;
  formData: KeyValuePair[];
  onFormAdd: () => void;
  onFormUpdate: (id: string, field: "key" | "value", value: string) => void;
  onFormToggle: (id: string) => void;
  onFormRemove: (id: string) => void;
}

const BODY_TYPES: { value: BodyType; label: string }[] = [
  { value: "NONE", label: "None" },
  { value: "JSON", label: "JSON" },
  { value: "RAW", label: "Raw" },
  { value: "FORM_DATA", label: "Form Data" }
];

const TEXTAREA_CLASSES =
  "h-48 w-full rounded-md border border-input bg-transparent p-3 font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function BodyEditor(props: BodyEditorProps) {
  return (
    <Tabs
      value={props.bodyType}
      onValueChange={(value) => props.onBodyTypeChange(value as BodyType)}
    >
      <TabsList>
        {BODY_TYPES.map((type) => (
          <TabsTrigger key={type.value} value={type.value}>
            {type.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="NONE" className="pt-3">
        <p className="py-4 text-sm text-muted-foreground">
          This request has no body.
        </p>
      </TabsContent>

      <TabsContent value="JSON" className="pt-3">
        <textarea
          value={props.bodyText}
          onChange={(event) => props.onBodyTextChange(event.target.value)}
          placeholder={'{\n  "key": "value"\n}'}
          spellCheck={false}
          className={TEXTAREA_CLASSES}
        />
      </TabsContent>

      <TabsContent value="RAW" className="pt-3">
        <textarea
          value={props.bodyText}
          onChange={(event) => props.onBodyTextChange(event.target.value)}
          placeholder="Raw request body"
          spellCheck={false}
          className={TEXTAREA_CLASSES}
        />
      </TabsContent>

      <TabsContent value="FORM_DATA" className="pt-3">
        <KeyValueEditor
          pairs={props.formData}
          onAdd={props.onFormAdd}
          onUpdate={props.onFormUpdate}
          onToggle={props.onFormToggle}
          onRemove={props.onFormRemove}
          keyPlaceholder="Field"
        />
      </TabsContent>
    </Tabs>
  );
}
