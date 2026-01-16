import { api } from './api';
import type { Topic, Content } from '@mathevolve/types';

export interface TopicWithContent {
  topic: Topic;
  content: Content[];
}

export async function getAllTopics(): Promise<{
  success: boolean;
  topics?: Topic[];
  error?: string;
}> {
  const response = await api.get<{ topics: Topic[] }>('/topics');

  if (response.success && response.data) {
    return { success: true, topics: response.data.topics };
  }

  return {
    success: false,
    error: response.error?.message || 'Failed to fetch topics',
  };
}

export async function getTopicById(id: string): Promise<{
  success: boolean;
  topic?: Topic;
  error?: string;
}> {
  const response = await api.get<{ topic: Topic }>(`/topics/${id}`);

  if (response.success && response.data) {
    return { success: true, topic: response.data.topic };
  }

  return {
    success: false,
    error: response.error?.message || 'Topic not found',
  };
}

export async function getTopicContent(id: string): Promise<{
  success: boolean;
  data?: TopicWithContent;
  error?: string;
}> {
  const response = await api.get<TopicWithContent>(`/topics/${id}/content`);

  if (response.success && response.data) {
    return { success: true, data: response.data };
  }

  return {
    success: false,
    error: response.error?.message || 'Failed to fetch content',
  };
}
