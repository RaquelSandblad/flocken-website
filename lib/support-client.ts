// =============================================================================
// SUPPORT CLIENT (Webb-version)
// =============================================================================
//
// Supabase-klient för att skicka support-ärenden från flocken.info
//
// =============================================================================

import { createClient } from '@supabase/supabase-js';

// Support system credentials
const SUPPORT_SUPABASE_URL = 'https://kgtopebjrrfnvbvytisz.supabase.co';
const SUPPORT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtndG9wZWJqcnJmbnZidnl0aXN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MzMzODEsImV4cCI6MjA4NjUwOTM4MX0.l00Q7qj-mYIgb4aKPKgagRSsVMUHXAfGOh7i9wAN5lY';

const APP_NAME = 'flocken';

interface DeviceInfo {
  platform: string;
  user_agent: string | null;
  screen_width: number | null;
  screen_height: number | null;
}

interface SubmitIssueParams {
  description: string;
  userEmail?: string;
  userName?: string;
  userId?: string;
}

interface SubmitIssueResult {
  success: boolean;
  issueId?: string;
  error?: string;
}

class SupportClient {
  private supabase;
  private appId: string | null = null;

  constructor() {
    this.supabase = createClient(SUPPORT_SUPABASE_URL, SUPPORT_SUPABASE_ANON_KEY);
  }

  /**
   * Hämta device-info från browsern
   */
  private getDeviceInfo(): DeviceInfo {
    if (typeof window === 'undefined') {
      return {
        platform: 'server',
        user_agent: null,
        screen_width: null,
        screen_height: null,
      };
    }

    return {
      platform: 'web',
      user_agent: navigator.userAgent,
      screen_width: window.screen.width,
      screen_height: window.screen.height,
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
   * Skicka ett support-ärende
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
          device_info: deviceInfo,
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
}

// Singleton-instans
export const supportClient = new SupportClient();

// Export för enkel användning
export const submitIssue = (params: SubmitIssueParams) => supportClient.submitIssue(params);
