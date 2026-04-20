import { supabase } from './supabase';

const toDateKey = (value = new Date()) => value.toISOString().split('T')[0];

const mapMissionRow = (row) => {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    uid: row.user_id,
    skillId: row.skill_id,
    dateKey: row.date_key,
    roadmapVersion: row.roadmap_version,
    generatedAt: row.generated_at,
    items: row.items || [],
    statusSummary: row.status_summary || { total: 0, completed: 0 },
  };
};

/**
 * Generate or fetch today's missions for a user and skill
 */
export const getMissionsForToday = async (uid, skillId) => {
  try {
    const today = toDateKey();
    const missionId = `${uid}_${today}_${skillId}`;
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .eq('id', missionId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return mapMissionRow(data);
  } catch (error) {
    console.error('Error fetching missions:', error);
    throw error;
  }
};

/**
 * Create or update a mission document
 */
export const saveMission = async (uid, skillId, missionData) => {
  try {
    const today = toDateKey();
    const missionId = `${uid}_${today}_${skillId}`;
    const {
      roadmapVersion,
      statusSummary,
      items = [],
      generatedAt,
    } = missionData || {};

    const payload = {
      id: missionId,
      user_id: uid,
      skill_id: skillId,
      date_key: today,
      generated_at: generatedAt || new Date().toISOString(),
      roadmap_version: roadmapVersion ?? 1,
      items,
      status_summary: statusSummary || {
        total: Array.isArray(items) ? items.length : 0,
        completed: 0,
      },
    };

    const { error } = await supabase.from('missions').upsert(payload, {
      onConflict: 'id',
    });

    if (error) {
      throw error;
    }

    return missionId;
  } catch (error) {
    console.error('Error saving mission:', error);
    throw error;
  }
};

/**
 * Update mission status for a specific item
 */
export const completeMissionItem = async (uid, skillId, missionId) => {
  try {
    const today = toDateKey();
    const docId = `${uid}_${today}_${skillId}`;
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .eq('id', docId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (data) {
      const currentItems = Array.isArray(data.items) ? data.items : [];
      const updatedItems = currentItems.map((item) =>
        item.missionId === missionId
          ? { ...item, status: 'completed', completedAt: new Date().toISOString() }
          : item
      );
      const completedCount = updatedItems.filter((item) => item.status === 'completed').length;

      const { error: updateError } = await supabase
        .from('missions')
        .update({
          items: updatedItems,
          status_summary: {
            total: updatedItems.length,
            completed: completedCount,
          },
        })
        .eq('id', docId);

      if (updateError) {
        throw updateError;
      }

      return mapMissionRow({
        ...data,
        items: updatedItems,
        status_summary: {
          total: updatedItems.length,
          completed: completedCount,
        },
      });
    }

    return null;
  } catch (error) {
    console.error('Error completing mission:', error);
    throw error;
  }
};
