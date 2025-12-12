export interface Note {
  id: string;
  title: string;
  content: string;
  realm: string; // e.g., "炼气期", "筑基期"
  createdAt: number;
  updatedAt: number;
}

export enum Realm {
  QI_CONDENSATION = "炼气期",
  FOUNDATION = "筑基期",
  GOLDEN_CORE = "金丹期",
  NASCENT_SOUL = "元婴期",
  SPIRIT_SEVERING = "化神期",
  VOID_SHATTERING = "炼虚期",
  MAHAYANA = "大乘期"
}

export interface SpiritResponse {
  content: string;
  isError: boolean;
}