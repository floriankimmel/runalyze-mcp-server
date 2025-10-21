import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Tool, Context } from '@rekog/mcp-nest';
import { z } from 'zod';
import type { AppConfig } from '../config/configuration';

const getActivityDetailSchema = z.object({
  id: z.number().int().positive().describe('The activity ID to retrieve'),
});

interface Sport {
  id: number;
  name: string;
  short_mode: boolean;
  kcal_per_hour: number;
  has_distance: boolean;
  has_power: boolean;
  is_outside: boolean;
}

interface ActivityType {
  id: number;
  name: string;
}

interface RaceResult {
  date: string;
  activity_id: number;
  race_event_id: number;
  official_distance: number;
  official_ascent: number;
  official_descent: number;
  officially_measured: boolean;
  name: string;
  place_total: number;
  place_gender: number;
  place_ageclass: number;
  participants_total: number;
  participants_gender: number;
  participants_ageclass: number;
  priority_level: string;
  status: string;
}

interface Tag {
  id: number;
  tag: string;
}

interface Equipment {
  id: number;
  name: string;
  notes: string;
}

interface Climb {
  id: number;
  category: string;
  fiets: number;
  duration: number;
  altitude_at_top: number;
  starts_at: number;
  end_geohash: string;
  avg_power: number;
}

interface Activity {
  id: number;
  sport: Sport;
  type: ActivityType;
  date_time: string;
  timezone_offset: number;
  title: string;
  partner: string;
  note: string;
  device_id: number;
  source: string;
  created_at: number;
  edited_at: number;
  is_track: boolean;
  distance: number;
  duration: number;
  elapsed_time: number;
  elevation_up: number;
  elevation_down: number;
  elevation_up_file: number;
  elevation_down_file: number;
  elevation_source: string;
  climb_score: number;
  percentage_hilly: number;
  uphill_efficiency: number;
  downhill_efficiency: number;
  vam: number;
  hr_avg: number;
  hr_max: number;
  hr_recovery: number;
  max_hr_drop_from: number;
  max_hr_drop: number;
  vo2max: number;
  vo2max_by_time: number;
  vo2max_with_elevation: number;
  use_vo2max: boolean;
  fit_vo2max_estimate: number;
  fit_recovery_time: number;
  fit_trimp: number;
  fit_hrv_analysis: number;
  fit_training_effect: number;
  fit_anaerobic_training_effect: number;
  fit_performance_condition: number;
  fit_performance_condition_end: number;
  fit_ftp: number;
  fit_sweat_loss: number;
  rpe: number;
  subjective_feeling: number;
  trimp: number;
  cadence: number;
  gap: number;
  x_pace: number;
  x_gap: number;
  aerobic_decoupling_pace: number;
  aerobic_decoupling_power: number;
  power: number;
  power_with_zero: number;
  air_power: number;
  is_power_calculated: boolean;
  x_power: number;
  x_power_with_zero: number;
  w_prime_balance_power_avg: number;
  w_prime_balance_power_min: number;
  w_prime_balance_pace_avg: number;
  w_prime_balance_pace_min: number;
  stamina_avg: number;
  stamina_min: number;
  stamina_potential_avg: number;
  stamina_potential_min: number;
  required_critical_power: number;
  required_critical_pace: number;
  required_critical_pace_vo2max: number;
  total_strokes: number;
  swolf: number;
  wheel_size: number;
  pool_length: number;
  stride_length: number;
  groundcontact: number;
  groundcontact_balance: number;
  vertical_oscillation: number;
  vertical_ratio: number;
  avg_impact_gs_left: number;
  avg_impact_gs_right: number;
  avg_braking_gs_left: number;
  avg_braking_gs_right: number;
  avg_footstrike_type_left: number;
  avg_footstrike_type_right: number;
  avg_pronation_excursion_left: number;
  avg_pronation_excursion_right: number;
  avg_leg_spring_stiffness: number;
  avg_respiratory_rate: number;
  avg_left_right_balance: number;
  avg_left_torque_effectiveness: number;
  avg_right_torque_effectiveness: number;
  avg_left_pedal_smoothness: number;
  avg_right_pedal_smoothness: number;
  avg_platform_center_offset_left: number;
  avg_platform_center_offset_right: number;
  avg_left_power_phase_start_angle: number;
  avg_left_power_phase_end_angle: number;
  avg_left_power_phase_peak_start_angle: number;
  avg_left_power_phase_peak_end_angle: number;
  avg_right_power_phase_start_angle: number;
  avg_right_power_phase_end_angle: number;
  avg_right_power_phase_peak_start_angle: number;
  avg_right_power_phase_peak_end_angle: number;
  cycling_total_grit: number;
  cycling_avg_flow: number;
  jumps: number;
  percentage_rider_position_seated: number;
  num_gear_change_events: number;
  avg_gear_ratio: number;
  temperature: number;
  wind_speed: number;
  wind_degree: number;
  humidity: number;
  cloud_cover: number;
  pressure: number;
  uv_index: number;
  ozone: number;
  is_night: boolean;
  weather_condition: string;
  weather_source: string;
  has_trackdata: boolean;
  race_result?: RaceResult;
  tags: Tag[];
  equipment: Equipment[];
  climbs: Climb[];
}

@Injectable()
export class RunalyzeActivityDetailTool {
  private readonly apiToken: string;
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService<AppConfig>) {
    // Get configuration values at startup
    // These are guaranteed to be defined due to config validation
    this.apiToken = this.configService.get<string>('runalyze.apiToken', { infer: true })!;
    this.baseUrl = this.configService.get<string>('runalyze.baseUrl', { infer: true })!;
  }

  @Tool({
    name: 'get-runalyze-activity-detail',
    description:
      'Retrieve detailed information for a specific activity by ID from the Runalyze API. Returns comprehensive activity data including sport type, performance metrics, weather data, equipment, and more.',
    parameters: getActivityDetailSchema,
  })
  async getActivityDetail(
    params: z.infer<typeof getActivityDetailSchema>,
    context: Context,
  ): Promise<string> {
    await context.reportProgress({ progress: 0, total: 100 });

    // Check if API token is configured
    if (!this.apiToken || this.apiToken.trim() === '') {
      return JSON.stringify(
        {
          error: 'Configuration Error',
          message:
            'RUNALYZE_API_TOKEN is not configured. Please set the environment variable or add it to your MCP client configuration.',
          instructions: {
            step1: 'Get your API token from https://runalyze.com/settings/personal-api',
            step2: 'Add RUNALYZE_API_TOKEN to your MCP client env configuration',
          },
        },
        null,
        2,
      );
    }

    try {
      const { id } = params;
      const endpoint = `${this.baseUrl}/api/v1/activity/${id}`;

      await context.reportProgress({ progress: 25, total: 100 });

      // Make the API request
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          token: this.apiToken,
        },
      });

      await context.reportProgress({ progress: 75, total: 100 });

      if (!response.ok) {
        if (response.status === 403) {
          return JSON.stringify(
            {
              error: 'Forbidden',
              message:
                'Access denied. Please check your API token and ensure you have premium access.',
              status: 403,
            },
            null,
            2,
          );
        }

        if (response.status === 401) {
          return JSON.stringify(
            {
              error: 'Unauthorized',
              message: 'Invalid API token.',
              status: 401,
            },
            null,
            2,
          );
        }

        if (response.status === 404) {
          return JSON.stringify(
            {
              error: 'Not Found',
              message: `Activity with ID ${id} not found.`,
              status: 404,
            },
            null,
            2,
          );
        }

        return JSON.stringify(
          {
            error: 'API Error',
            message: `Request failed with status ${response.status}`,
            status: response.status,
          },
          null,
          2,
        );
      }

      const data = (await response.json()) as Activity;

      await context.reportProgress({ progress: 100, total: 100 });

      return JSON.stringify(data, null, 2);
    } catch (error) {
      await context.reportProgress({ progress: 100, total: 100 });

      return JSON.stringify(
        {
          error: 'Request Failed',
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          details: String(error),
        },
        null,
        2,
      );
    }
  }
}
