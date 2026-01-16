import { supabase } from '../db/client.js';
import type { Topic, Content } from '@mathevolve/types';

export async function getAllTopics(): Promise<Topic[]> {
  try {
    const { data: topics, error } = await supabase
      .from('topics')
      .select('id, name, slug, description, order_index')
      .order('order_index', { ascending: true });

    if (error || !topics) {
      console.error('Get topics error:', error);
      return [];
    }

    return topics.map((t) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      description: t.description,
      orderIndex: t.order_index,
    }));
  } catch (error) {
    console.error('Get all topics error:', error);
    return [];
  }
}

export async function getTopicById(id: string): Promise<Topic | null> {
  try {
    const { data: topic, error } = await supabase
      .from('topics')
      .select('id, name, slug, description, order_index')
      .eq('id', id)
      .single();

    if (error || !topic) {
      return null;
    }

    return {
      id: topic.id,
      name: topic.name,
      slug: topic.slug,
      description: topic.description,
      orderIndex: topic.order_index,
    };
  } catch (error) {
    console.error('Get topic by id error:', error);
    return null;
  }
}

export async function getTopicBySlug(slug: string): Promise<Topic | null> {
  try {
    const { data: topic, error } = await supabase
      .from('topics')
      .select('id, name, slug, description, order_index')
      .eq('slug', slug)
      .single();

    if (error || !topic) {
      return null;
    }

    return {
      id: topic.id,
      name: topic.name,
      slug: topic.slug,
      description: topic.description,
      orderIndex: topic.order_index,
    };
  } catch (error) {
    console.error('Get topic by slug error:', error);
    return null;
  }
}

export async function getContentByTopicId(topicId: string): Promise<Content[]> {
  try {
    const { data: content, error } = await supabase
      .from('content')
      .select('id, topic_id, content_type, title, body, metadata, order_index')
      .eq('topic_id', topicId)
      .order('order_index', { ascending: true });

    if (error || !content) {
      console.error('Get content error:', error);
      return [];
    }

    return content.map((c) => ({
      id: c.id,
      topicId: c.topic_id,
      contentType: c.content_type as 'formula' | 'tutorial' | 'step',
      title: c.title,
      body: c.body,
      metadata: c.metadata,
      orderIndex: c.order_index,
    }));
  } catch (error) {
    console.error('Get content by topic error:', error);
    return [];
  }
}

export async function getContentById(id: string): Promise<Content | null> {
  try {
    const { data: content, error } = await supabase
      .from('content')
      .select('id, topic_id, content_type, title, body, metadata, order_index')
      .eq('id', id)
      .single();

    if (error || !content) {
      return null;
    }

    return {
      id: content.id,
      topicId: content.topic_id,
      contentType: content.content_type as 'formula' | 'tutorial' | 'step',
      title: content.title,
      body: content.body,
      metadata: content.metadata,
      orderIndex: content.order_index,
    };
  } catch (error) {
    console.error('Get content by id error:', error);
    return null;
  }
}
