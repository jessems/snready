// Agent work packets. LLM stages never call a model directly: they write packets,
// a Claude Code agent fills in the outputs, and an `ingest` step validates them.
import fs from "node:fs";
import path from "node:path";
import { paths, readJson, writeJson } from "./io";

export interface Packet<I> {
  stage: string;
  cert: string;
  packetId: string;
  prompt: string; // repo-relative path to the instructions
  output: string; // absolute path the agent must write
  input: I;
}

export function writePackets<I>(stage: string, cert: string, prompt: string, inputs: Array<{ id: string; input: I }>): string[] {
  const dir = paths.packets(stage, cert);
  fs.mkdirSync(dir, { recursive: true });
  const written: string[] = [];
  for (const { id, input } of inputs) {
    const file = path.join(dir, `${id}.in.json`);
    const packet: Packet<I> = {
      stage,
      cert,
      packetId: id,
      prompt: path.join("pipeline", "prompts", prompt),
      output: path.join(dir, `${id}.out.json`),
      input,
    };
    writeJson(file, packet);
    written.push(file);
  }
  return written;
}

export function packetStatus(stage: string, cert: string): { pending: string[]; done: string[] } {
  const dir = paths.packets(stage, cert);
  if (!fs.existsSync(dir)) return { pending: [], done: [] };
  const ids = fs.readdirSync(dir).filter((f) => f.endsWith(".in.json")).map((f) => f.replace(/\.in\.json$/, ""));
  const done = ids.filter((id) => fs.existsSync(path.join(dir, `${id}.out.json`)));
  return { pending: ids.filter((id) => !done.includes(id)), done };
}

export function readPacketOutputs<I, O>(stage: string, cert: string): Array<{ packet: Packet<I>; output: O }> {
  const dir = paths.packets(stage, cert);
  return packetStatus(stage, cert).done.map((id) => ({
    packet: readJson<Packet<I>>(path.join(dir, `${id}.in.json`)),
    output: readJson<O>(path.join(dir, `${id}.out.json`)),
  }));
}

/** Next free packet number, and the inputs of every packet already written for this stage. */
export function existingPackets<I>(stage: string, cert: string): { next: number; inputs: I[] } {
  const dir = paths.packets(stage, cert);
  if (!fs.existsSync(dir)) return { next: 1, inputs: [] };
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".in.json"));
  return { next: files.length + 1, inputs: files.map((f) => readJson<Packet<I>>(path.join(dir, f)).input) };
}

export function clearPackets(stage: string, cert: string): void {
  fs.rmSync(paths.packets(stage, cert), { recursive: true, force: true });
}
