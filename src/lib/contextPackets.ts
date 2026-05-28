import {
  CONTEXT_PACKET_SCHEMA_VERSION,
  contextPacketActionKinds,
  contextPacketPriorities,
  contextPacketWarningLevels,
  type ContextActionHint,
  type ContextMemorySection,
  type ContextPacket,
  type ContextPacketValidationResult,
  type ContextPacketWarning,
} from "@/types/contextPacket";

const isString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isOptionalString = (value: unknown): value is string | undefined =>
  value === undefined || typeof value === "string";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);

const includesValue = <T extends readonly string[]>(values: T, value: unknown): value is T[number] =>
  typeof value === "string" && values.includes(value);

const isIsoDateLike = (value: unknown): value is string =>
  typeof value === "string" && !Number.isNaN(Date.parse(value));

const validateMemorySection = (value: unknown, index: number, errors: string[]): value is ContextMemorySection => {
  if (!isRecord(value)) {
    errors.push(`memorySections[${index}] must be an object.`);
    return false;
  }

  if (!isString(value.id)) errors.push(`memorySections[${index}].id is required.`);
  if (!isString(value.label)) errors.push(`memorySections[${index}].label is required.`);
  if (!isString(value.content)) errors.push(`memorySections[${index}].content is required.`);
  if (!includesValue(contextPacketPriorities, value.priority)) {
    errors.push(`memorySections[${index}].priority is invalid.`);
  }
  if (!isOptionalString(value.source)) errors.push(`memorySections[${index}].source must be a string.`);
  if (value.metadata !== undefined && !isRecord(value.metadata)) {
    errors.push(`memorySections[${index}].metadata must be an object.`);
  }

  return true;
};

const validateWarning = (value: unknown, index: number, errors: string[]): value is ContextPacketWarning => {
  if (!isRecord(value)) {
    errors.push(`warnings[${index}] must be an object.`);
    return false;
  }

  if (!isString(value.id)) errors.push(`warnings[${index}].id is required.`);
  if (!includesValue(contextPacketWarningLevels, value.level)) {
    errors.push(`warnings[${index}].level is invalid.`);
  }
  if (!isString(value.message)) errors.push(`warnings[${index}].message is required.`);

  return true;
};

const validateActionHint = (value: unknown, index: number, errors: string[]): value is ContextActionHint => {
  if (!isRecord(value)) {
    errors.push(`actionHints[${index}] must be an object.`);
    return false;
  }

  if (!isString(value.id)) errors.push(`actionHints[${index}].id is required.`);
  if (!isString(value.label)) errors.push(`actionHints[${index}].label is required.`);
  if (!includesValue(contextPacketActionKinds, value.kind)) {
    errors.push(`actionHints[${index}].kind is invalid.`);
  }
  if (!isOptionalString(value.description)) errors.push(`actionHints[${index}].description must be a string.`);
  if (value.payload !== undefined && !isRecord(value.payload)) {
    errors.push(`actionHints[${index}].payload must be an object.`);
  }

  return true;
};

export const createContextPacket = (input: Omit<ContextPacket, "schemaVersion" | "createdAt"> & {
  createdAt?: string;
}): ContextPacket => ({
  schemaVersion: CONTEXT_PACKET_SCHEMA_VERSION,
  ...input,
  createdAt: input.createdAt ?? new Date().toISOString(),
});

export const validateContextPacket = (value: unknown): ContextPacketValidationResult => {
  const errors: string[] = [];

  if (!isRecord(value)) {
    return { ok: false, errors: ["Context packet must be an object."] };
  }

  const candidate = value as Partial<ContextPacket>;

  if (candidate.schemaVersion !== CONTEXT_PACKET_SCHEMA_VERSION) {
    errors.push(`schemaVersion must be ${CONTEXT_PACKET_SCHEMA_VERSION}.`);
  }

  if (!isRecord(candidate.sourceApp)) {
    errors.push("sourceApp is required.");
  } else {
    if (!isString(candidate.sourceApp.id)) errors.push("sourceApp.id is required.");
    if (!isString(candidate.sourceApp.name)) errors.push("sourceApp.name is required.");
    if (!isOptionalString(candidate.sourceApp.version)) errors.push("sourceApp.version must be a string.");
  }

  if (!isOptionalString(candidate.projectId)) errors.push("projectId must be a string.");
  if (!isOptionalString(candidate.activeTool)) errors.push("activeTool must be a string.");
  if (!isString(candidate.currentScreenContext)) errors.push("currentScreenContext is required.");
  if (!isOptionalString(candidate.selectedText)) errors.push("selectedText must be a string.");

  if (candidate.selectedEntity !== undefined) {
    if (!isRecord(candidate.selectedEntity)) {
      errors.push("selectedEntity must be an object.");
    } else {
      if (!isOptionalString(candidate.selectedEntity.id)) errors.push("selectedEntity.id must be a string.");
      if (!isString(candidate.selectedEntity.type)) errors.push("selectedEntity.type is required.");
      if (!isString(candidate.selectedEntity.label)) errors.push("selectedEntity.label is required.");
      if (!isOptionalString(candidate.selectedEntity.value)) errors.push("selectedEntity.value must be a string.");
      if (candidate.selectedEntity.metadata !== undefined && !isRecord(candidate.selectedEntity.metadata)) {
        errors.push("selectedEntity.metadata must be an object.");
      }
    }
  }

  if (!Array.isArray(candidate.memorySections)) {
    errors.push("memorySections must be an array.");
  } else {
    candidate.memorySections.forEach((item, index) => validateMemorySection(item, index, errors));
  }

  if (!Array.isArray(candidate.warnings)) {
    errors.push("warnings must be an array.");
  } else {
    candidate.warnings.forEach((item, index) => validateWarning(item, index, errors));
  }

  if (!isRecord(candidate.metadata)) errors.push("metadata must be an object.");

  if (!Array.isArray(candidate.actionHints)) {
    errors.push("actionHints must be an array.");
  } else {
    candidate.actionHints.forEach((item, index) => validateActionHint(item, index, errors));
  }

  if (!isIsoDateLike(candidate.createdAt)) errors.push("createdAt must be an ISO date string.");

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, packet: candidate as ContextPacket };
};

export const stringifyContextPacket = (packet: ContextPacket): string =>
  JSON.stringify(packet, null, 2);
