import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { RunalyzeActivitiesTool } from '../runalyze-activities.tool';

describe('RunalyzeActivitiesTool', () => {
  let tool: RunalyzeActivitiesTool;
  let mockContext: any;
  let mockFetch: jest.SpyInstance;

  beforeEach(async () => {
    const mockConfigService = {
      get: jest.fn((key: string) => {
        const config: Record<string, string> = {
          'runalyze.apiToken': 'test-token',
          'runalyze.baseUrl': 'https://runalyze.com',
        };
        return config[key];
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RunalyzeActivitiesTool,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    tool = module.get<RunalyzeActivitiesTool>(RunalyzeActivitiesTool);

    // Mock context for progress reporting
    mockContext = {
      reportProgress: jest.fn().mockResolvedValue(undefined),
    };

    // Mock global fetch
    mockFetch = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    mockFetch.mockRestore();
  });

  it('should be defined', () => {
    expect(tool).toBeDefined();
  });

  describe('getActivities', () => {
    it('should successfully retrieve activities data', async () => {
      const mockData = [
        {
          id: 1,
          sport: {
            id: 1,
            name: 'Running',
            short_mode: false,
            kcal_per_hour: 600,
            has_distance: true,
            has_power: true,
            is_outside: true,
          },
          type: {
            id: 1,
            name: 'Easy Run',
          },
          date_time: '2024-01-01T08:00:00Z',
          timezone_offset: 0,
          title: 'Morning Run',
          partner: '',
          note: '',
          device_id: 0,
          source: 'garmin',
          created_at: 1704096000,
          edited_at: 1704096000,
          is_track: false,
          distance: 10000,
          duration: 3600,
          elapsed_time: 3600,
          elevation_up: 100,
          elevation_down: 100,
          elevation_up_file: 100,
          elevation_down_file: 100,
          elevation_source: 'file',
          climb_score: 5,
          percentage_hilly: 50,
          uphill_efficiency: 95,
          downhill_efficiency: 95,
          vam: 100,
          hr_avg: 150,
          hr_max: 180,
          hr_recovery: 60,
          max_hr_drop_from: 180,
          max_hr_drop: 20,
          vo2max: 55,
          vo2max_by_time: 55,
          vo2max_with_elevation: 56,
          use_vo2max: true,
          fit_vo2max_estimate: 55,
          fit_recovery_time: 24,
          fit_trimp: 100,
          fit_hrv_analysis: 65,
          fit_training_effect: 3.5,
          fit_anaerobic_training_effect: 1.5,
          fit_performance_condition: 100,
          fit_performance_condition_end: 100,
          fit_ftp: 250,
          fit_sweat_loss: 1000,
          rpe: 6,
          subjective_feeling: 3,
          trimp: 100,
          cadence: 180,
          gap: 360,
          x_pace: 360,
          x_gap: 360,
          aerobic_decoupling_pace: 0,
          aerobic_decoupling_power: 0,
          power: 0,
          power_with_zero: 0,
          air_power: 0,
          is_power_calculated: false,
          x_power: 0,
          x_power_with_zero: 0,
          w_prime_balance_power_avg: 0,
          w_prime_balance_power_min: 0,
          w_prime_balance_pace_avg: 0,
          w_prime_balance_pace_min: 0,
          stamina_avg: 0,
          stamina_min: 0,
          stamina_potential_avg: 0,
          stamina_potential_min: 0,
          required_critical_power: 0,
          required_critical_pace: 0,
          required_critical_pace_vo2max: 0,
          total_strokes: 0,
          swolf: 0,
          wheel_size: 0,
          pool_length: 0,
          stride_length: 1.2,
          groundcontact: 250,
          groundcontact_balance: 50,
          vertical_oscillation: 80,
          vertical_ratio: 8,
          avg_impact_gs_left: 0,
          avg_impact_gs_right: 0,
          avg_braking_gs_left: 0,
          avg_braking_gs_right: 0,
          avg_footstrike_type_left: 0,
          avg_footstrike_type_right: 0,
          avg_pronation_excursion_left: 0,
          avg_pronation_excursion_right: 0,
          avg_leg_spring_stiffness: 0,
          avg_respiratory_rate: 0,
          avg_left_right_balance: 0,
          avg_left_torque_effectiveness: 0,
          avg_right_torque_effectiveness: 0,
          avg_left_pedal_smoothness: 0,
          avg_right_pedal_smoothness: 0,
          avg_platform_center_offset_left: 0,
          avg_platform_center_offset_right: 0,
          avg_left_power_phase_start_angle: 0,
          avg_left_power_phase_end_angle: 0,
          avg_left_power_phase_peak_start_angle: 0,
          avg_left_power_phase_peak_end_angle: 0,
          avg_right_power_phase_start_angle: 0,
          avg_right_power_phase_end_angle: 0,
          avg_right_power_phase_peak_start_angle: 0,
          avg_right_power_phase_peak_end_angle: 0,
          cycling_total_grit: 0,
          cycling_avg_flow: 0,
          jumps: 0,
          percentage_rider_position_seated: 0,
          num_gear_change_events: 0,
          avg_gear_ratio: 0,
          temperature: 15,
          wind_speed: 5,
          wind_degree: 180,
          humidity: 60,
          cloud_cover: 20,
          pressure: 1013,
          uv_index: 3,
          ozone: 300,
          is_night: false,
          weather_condition: 'clear',
          weather_source: 'apple',
          has_trackdata: true,
          tags: [],
          equipment: [],
          climbs: [],
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
      } as Response);

      const result = await tool.getActivities(
        {
          page: 1,
        },
        mockContext,
      );

      const parsed = JSON.parse(result);

      expect(parsed.data).toEqual(mockData);
      expect(parsed.page).toBe(1);
      expect(parsed.totalItems).toBe(1);
      expect(mockFetch).toHaveBeenCalledWith('https://runalyze.com/api/v1/activity?page=1', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          token: 'test-token',
        },
      });
      expect(mockContext.reportProgress).toHaveBeenCalledTimes(4);
    });

    it('should handle pagination parameter', async () => {
      const mockData = [
        {
          id: 2,
          sport: {
            id: 2,
            name: 'Cycling',
            short_mode: false,
            kcal_per_hour: 500,
            has_distance: true,
            has_power: true,
            is_outside: true,
          },
          type: {
            id: 2,
            name: 'Recovery',
          },
          date_time: '2024-01-02T08:00:00Z',
          timezone_offset: 0,
          title: 'Recovery Ride',
          partner: '',
          note: '',
          device_id: 0,
          source: 'garmin',
          created_at: 1704182400,
          edited_at: 1704182400,
          is_track: false,
          distance: 20000,
          duration: 3600,
          elapsed_time: 3600,
          elevation_up: 200,
          elevation_down: 200,
          elevation_up_file: 200,
          elevation_down_file: 200,
          elevation_source: 'file',
          climb_score: 10,
          percentage_hilly: 60,
          uphill_efficiency: 90,
          downhill_efficiency: 90,
          vam: 150,
          hr_avg: 130,
          hr_max: 160,
          hr_recovery: 55,
          max_hr_drop_from: 160,
          max_hr_drop: 15,
          vo2max: 0,
          vo2max_by_time: 0,
          vo2max_with_elevation: 0,
          use_vo2max: false,
          fit_vo2max_estimate: 0,
          fit_recovery_time: 12,
          fit_trimp: 80,
          fit_hrv_analysis: 70,
          fit_training_effect: 2.5,
          fit_anaerobic_training_effect: 0.5,
          fit_performance_condition: 100,
          fit_performance_condition_end: 100,
          fit_ftp: 250,
          fit_sweat_loss: 800,
          rpe: 4,
          subjective_feeling: 4,
          trimp: 80,
          cadence: 90,
          gap: 0,
          x_pace: 0,
          x_gap: 0,
          aerobic_decoupling_pace: 0,
          aerobic_decoupling_power: 0,
          power: 150,
          power_with_zero: 150,
          air_power: 0,
          is_power_calculated: false,
          x_power: 160,
          x_power_with_zero: 160,
          w_prime_balance_power_avg: 0,
          w_prime_balance_power_min: 0,
          w_prime_balance_pace_avg: 0,
          w_prime_balance_pace_min: 0,
          stamina_avg: 0,
          stamina_min: 0,
          stamina_potential_avg: 0,
          stamina_potential_min: 0,
          required_critical_power: 0,
          required_critical_pace: 0,
          required_critical_pace_vo2max: 0,
          total_strokes: 0,
          swolf: 0,
          wheel_size: 2100,
          pool_length: 0,
          stride_length: 0,
          groundcontact: 0,
          groundcontact_balance: 0,
          vertical_oscillation: 0,
          vertical_ratio: 0,
          avg_impact_gs_left: 0,
          avg_impact_gs_right: 0,
          avg_braking_gs_left: 0,
          avg_braking_gs_right: 0,
          avg_footstrike_type_left: 0,
          avg_footstrike_type_right: 0,
          avg_pronation_excursion_left: 0,
          avg_pronation_excursion_right: 0,
          avg_leg_spring_stiffness: 0,
          avg_respiratory_rate: 0,
          avg_left_right_balance: 50,
          avg_left_torque_effectiveness: 95,
          avg_right_torque_effectiveness: 95,
          avg_left_pedal_smoothness: 30,
          avg_right_pedal_smoothness: 30,
          avg_platform_center_offset_left: 0,
          avg_platform_center_offset_right: 0,
          avg_left_power_phase_start_angle: 0,
          avg_left_power_phase_end_angle: 0,
          avg_left_power_phase_peak_start_angle: 0,
          avg_left_power_phase_peak_end_angle: 0,
          avg_right_power_phase_start_angle: 0,
          avg_right_power_phase_end_angle: 0,
          avg_right_power_phase_peak_start_angle: 0,
          avg_right_power_phase_peak_end_angle: 0,
          cycling_total_grit: 0,
          cycling_avg_flow: 0,
          jumps: 0,
          percentage_rider_position_seated: 80,
          num_gear_change_events: 50,
          avg_gear_ratio: 3.5,
          temperature: 18,
          wind_speed: 10,
          wind_degree: 90,
          humidity: 55,
          cloud_cover: 30,
          pressure: 1015,
          uv_index: 5,
          ozone: 310,
          is_night: false,
          weather_condition: 'partly_cloudy',
          weather_source: 'apple',
          has_trackdata: true,
          tags: [],
          equipment: [],
          climbs: [],
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
      } as Response);

      await tool.getActivities(
        {
          page: 3,
        },
        mockContext,
      );

      expect(mockFetch).toHaveBeenCalledWith(
        'https://runalyze.com/api/v1/activity?page=3',
        expect.any(Object),
      );
    });

    it('should handle 403 Forbidden error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
      } as Response);

      const result = await tool.getActivities(
        {
          page: 1,
        },
        mockContext,
      );

      const parsed = JSON.parse(result);

      expect(parsed.error).toBe('Forbidden');
      expect(parsed.status).toBe(403);
      expect(parsed.message).toContain('Access denied');
      expect(mockContext.reportProgress).toHaveBeenCalled();
    });

    it('should handle 401 Unauthorized error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
      } as Response);

      const result = await tool.getActivities(
        {
          page: 1,
        },
        mockContext,
      );

      const parsed = JSON.parse(result);

      expect(parsed.error).toBe('Unauthorized');
      expect(parsed.status).toBe(401);
      expect(parsed.message).toContain('Invalid Runalyze API token');
    });

    it('should handle other HTTP errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response);

      const result = await tool.getActivities(
        {
          page: 1,
        },
        mockContext,
      );

      const parsed = JSON.parse(result);

      expect(parsed.error).toBe('API Error');
      expect(parsed.status).toBe(500);
      expect(parsed.message).toContain('Request failed with status 500');
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await tool.getActivities(
        {
          page: 1,
        },
        mockContext,
      );

      const parsed = JSON.parse(result);

      expect(parsed.error).toBe('Request Failed');
      expect(parsed.message).toBe('Network error');
      expect(mockContext.reportProgress).toHaveBeenLastCalledWith({
        progress: 100,
        total: 100,
      });
    });

    it('should handle empty data response', async () => {
      const mockData: any[] = [];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
      } as Response);

      const result = await tool.getActivities(
        {
          page: 1,
        },
        mockContext,
      );

      const parsed = JSON.parse(result);

      expect(parsed.data).toEqual([]);
      expect(parsed.totalItems).toBe(0);
    });

    it('should report progress at correct intervals', async () => {
      const mockData = [
        {
          id: 1,
          sport: {
            id: 1,
            name: 'Running',
            short_mode: false,
            kcal_per_hour: 600,
            has_distance: true,
            has_power: true,
            is_outside: true,
          },
          type: {
            id: 1,
            name: 'Easy Run',
          },
          date_time: '2024-01-01T08:00:00Z',
          timezone_offset: 0,
          title: 'Morning Run',
          partner: '',
          note: '',
          device_id: 0,
          source: 'garmin',
          created_at: 1704096000,
          edited_at: 1704096000,
          is_track: false,
          distance: 10000,
          duration: 3600,
          elapsed_time: 3600,
          elevation_up: 100,
          elevation_down: 100,
          elevation_up_file: 100,
          elevation_down_file: 100,
          elevation_source: 'file',
          climb_score: 5,
          percentage_hilly: 50,
          uphill_efficiency: 95,
          downhill_efficiency: 95,
          vam: 100,
          hr_avg: 150,
          hr_max: 180,
          hr_recovery: 60,
          max_hr_drop_from: 180,
          max_hr_drop: 20,
          vo2max: 55,
          vo2max_by_time: 55,
          vo2max_with_elevation: 56,
          use_vo2max: true,
          fit_vo2max_estimate: 55,
          fit_recovery_time: 24,
          fit_trimp: 100,
          fit_hrv_analysis: 65,
          fit_training_effect: 3.5,
          fit_anaerobic_training_effect: 1.5,
          fit_performance_condition: 100,
          fit_performance_condition_end: 100,
          fit_ftp: 250,
          fit_sweat_loss: 1000,
          rpe: 6,
          subjective_feeling: 3,
          trimp: 100,
          cadence: 180,
          gap: 360,
          x_pace: 360,
          x_gap: 360,
          aerobic_decoupling_pace: 0,
          aerobic_decoupling_power: 0,
          power: 0,
          power_with_zero: 0,
          air_power: 0,
          is_power_calculated: false,
          x_power: 0,
          x_power_with_zero: 0,
          w_prime_balance_power_avg: 0,
          w_prime_balance_power_min: 0,
          w_prime_balance_pace_avg: 0,
          w_prime_balance_pace_min: 0,
          stamina_avg: 0,
          stamina_min: 0,
          stamina_potential_avg: 0,
          stamina_potential_min: 0,
          required_critical_power: 0,
          required_critical_pace: 0,
          required_critical_pace_vo2max: 0,
          total_strokes: 0,
          swolf: 0,
          wheel_size: 0,
          pool_length: 0,
          stride_length: 1.2,
          groundcontact: 250,
          groundcontact_balance: 50,
          vertical_oscillation: 80,
          vertical_ratio: 8,
          avg_impact_gs_left: 0,
          avg_impact_gs_right: 0,
          avg_braking_gs_left: 0,
          avg_braking_gs_right: 0,
          avg_footstrike_type_left: 0,
          avg_footstrike_type_right: 0,
          avg_pronation_excursion_left: 0,
          avg_pronation_excursion_right: 0,
          avg_leg_spring_stiffness: 0,
          avg_respiratory_rate: 0,
          avg_left_right_balance: 0,
          avg_left_torque_effectiveness: 0,
          avg_right_torque_effectiveness: 0,
          avg_left_pedal_smoothness: 0,
          avg_right_pedal_smoothness: 0,
          avg_platform_center_offset_left: 0,
          avg_platform_center_offset_right: 0,
          avg_left_power_phase_start_angle: 0,
          avg_left_power_phase_end_angle: 0,
          avg_left_power_phase_peak_start_angle: 0,
          avg_left_power_phase_peak_end_angle: 0,
          avg_right_power_phase_start_angle: 0,
          avg_right_power_phase_end_angle: 0,
          avg_right_power_phase_peak_start_angle: 0,
          avg_right_power_phase_peak_end_angle: 0,
          cycling_total_grit: 0,
          cycling_avg_flow: 0,
          jumps: 0,
          percentage_rider_position_seated: 0,
          num_gear_change_events: 0,
          avg_gear_ratio: 0,
          temperature: 15,
          wind_speed: 5,
          wind_degree: 180,
          humidity: 60,
          cloud_cover: 20,
          pressure: 1013,
          uv_index: 3,
          ozone: 300,
          is_night: false,
          weather_condition: 'clear',
          weather_source: 'apple',
          has_trackdata: true,
          tags: [],
          equipment: [],
          climbs: [],
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
      } as Response);

      await tool.getActivities(
        {
          page: 1,
        },
        mockContext,
      );

      expect(mockContext.reportProgress).toHaveBeenNthCalledWith(1, {
        progress: 0,
        total: 100,
      });
      expect(mockContext.reportProgress).toHaveBeenNthCalledWith(2, {
        progress: 25,
        total: 100,
      });
      expect(mockContext.reportProgress).toHaveBeenNthCalledWith(3, {
        progress: 75,
        total: 100,
      });
      expect(mockContext.reportProgress).toHaveBeenNthCalledWith(4, {
        progress: 100,
        total: 100,
      });
    });

    it('should return error when API token is not configured', async () => {
      // Create a new tool instance without API token
      const mockConfigServiceNoToken = {
        get: jest.fn((key: string) => {
          const config: Record<string, string> = {
            'runalyze.apiToken': '',
            'runalyze.baseUrl': 'https://runalyze.com',
          };
          return config[key];
        }),
      };

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          RunalyzeActivitiesTool,
          {
            provide: ConfigService,
            useValue: mockConfigServiceNoToken,
          },
        ],
      }).compile();

      const toolNoToken = module.get<RunalyzeActivitiesTool>(RunalyzeActivitiesTool);

      const result = await toolNoToken.getActivities(
        {
          page: 1,
        },
        mockContext,
      );

      const parsed = JSON.parse(result);

      expect(parsed.error).toBe('Authentication Required');
      expect(parsed.message).toContain('No Runalyze API token provided');
      expect(parsed.instructions).toBeDefined();
    });
  });
});
