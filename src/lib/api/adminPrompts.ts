import { api } from './client';
import type {
  AgentPromptDto,
  AgentPromptListResponse,
  AgentPromptUpdateRequest,
} from './types';

const BASE = '/api/project-health/admin/prompts';

export async function list(): Promise<AgentPromptDto[]> {
  const { data } = await api.get<AgentPromptListResponse>(BASE);
  return data.prompts;
}

export async function get(promptKey: string): Promise<AgentPromptDto> {
  const { data } = await api.get<AgentPromptDto>(`${BASE}/${promptKey}`);
  return data;
}

export async function update(
  promptKey: string,
  payload: AgentPromptUpdateRequest,
): Promise<AgentPromptDto> {
  const { data } = await api.put<AgentPromptDto>(`${BASE}/${promptKey}`, payload);
  return data;
}

export async function reset(promptKey: string): Promise<AgentPromptDto> {
  const { data } = await api.post<AgentPromptDto>(`${BASE}/${promptKey}/reset`);
  return data;
}
