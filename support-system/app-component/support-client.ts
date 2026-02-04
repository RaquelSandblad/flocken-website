// =============================================================================
// SUPPORT CLIENT
// =============================================================================
//
// Klient för att skicka ärenden till support-systemet.
// Ska importeras i appen.
//
// =============================================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Device from 'expo-device';

// Konfigurera dessa värden för ditt support-projekt
const SUPPORT_SUPABASE_URL = 'https://YOUR_SUPPORT_PROJECT.supabase.co';
const SUPPORT_SUPABASE_ANON_KEY = 'eyJ...'; // Anon key för support-projektet
const APP_NAME = 'flocken'; // Ändra för andra appar

interface DeviceInfo {
  platform: string;
  os_version: string | null;
  device_model: string | null;
  app_version: string | null;
  brand: string | null;
}

interface SubmitIssueParams {
  description: string;
  userEmail?: string;
  userName?: string;
  userId?: string;
  screenshotUrls?: string[];
}

interface SubmitIssueResult {
  success: boolean;
  issueId?: string;
  error?: string;
}

class SupportClient {
  private supabase: SupabaseClient;
  private appId: string | null = null;

  constructor() {
    this.supabase = createClient(SUPPORT_SUPABASE_URL, SUPPORT_SUPABASE_ANON_KEY);
  }

  /**
   * Hämta device-info automatiskt
   */
  private getDeviceInfo(): DeviceInfo {
    return {
      platform: Platform.OS,
      os_version: Platform.Version?.toString() || null,
      device_model: Device.modelName,
      app_version: Constants.expoConfig?.version || null,
      brand: Device.brand,
    };
  }

  /**
   * Hämta app_id från databasen (cachas)
   */
  private async getAppId(): Promise<string> {
    if (this.appId) return this.appId;

    const { data, error } = await this.supabase
      .from('apps')
      .select('id')
      .eq('name', APP_NAME)
      .single();

    if (error || !data) {
      throw new Error(`App '${APP_NAME}' not found in support system`);
    }

    this.appId = data.id;
    return this.appId;
  }

  /**
   * Skicka ett ärende till support
   */
  async submitIssue(params: SubmitIssueParams): Promise<SubmitIssueResult> {
    try {
      const appId = await this.getAppId();
      const deviceInfo = this.getDeviceInfo();

      const { data, error } = await this.supabase
        .from('issues')
        .insert({
          app_id: appId,
          description: params.description,
          user_email: params.userEmail,
          user_name: params.userName,
          user_id: params.userId,
          screenshot_urls: params.screenshotUrls,
          device_info: deviceInfo,
          app_version: deviceInfo.app_version,
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error submitting issue:', error);
        return { success: false, error: error.message };
      }

      return { success: true, issueId: data.id };
    } catch (error) {
      console.error('Error submitting issue:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Hämta användarens egna ärenden (om inloggad)
   */
  async getMyIssues(userId: string): Promise<unknown[]> {
    const { data, error } = await this.supabase
      .from('issues')
      .select('id, title, status, created_at, ai_priority')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching issues:', error);
      return [];
    }

    return data || [];
  }
}

// Singleton-instans
export const supportClient = new SupportClient();

// Export för enkel användning
export const submitIssue = (params: SubmitIssueParams) => supportClient.submitIssue(params);
export const getMyIssues = (userId: string) => supportClient.getMyIssues(userId);
