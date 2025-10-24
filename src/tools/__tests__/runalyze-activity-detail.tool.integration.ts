import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { RunalyzeActivityDetailTool } from '../runalyze-activity-detail.tool';

describe('RunalyzeActivityDetailTool', () => {
  let tool: RunalyzeActivityDetailTool;
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
        RunalyzeActivityDetailTool,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    tool = module.get<RunalyzeActivityDetailTool>(RunalyzeActivityDetailTool);

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

  describe('getActivityDetail', () => {
    it('should successfully retrieve activity detail by ID', async () => {
      const mockData = {
        id: 12345,
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
        note: 'Great run!',
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
        tags: [{ id: 1, tag: 'race' }],
        equipment: [{ id: 1, name: 'Nike Pegasus', notes: 'Main shoes' }],
        climbs: [],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
      } as Response);

      const result = await tool.getActivityDetail(
        {
          id: 12345,
        },
        mockContext,
      );

      const parsed = JSON.parse(result);

      expect(parsed).toEqual(mockData);
      expect(parsed.id).toBe(12345);
      expect(parsed.title).toBe('Morning Run');
      expect(mockFetch).toHaveBeenCalledWith('https://runalyze.com/api/v1/activity/12345', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          token: 'test-token',
        },
      });
      expect(mockContext.reportProgress).toHaveBeenCalledTimes(4);
    });

    it('should handle 404 Not Found error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response);

      const result = await tool.getActivityDetail(
        {
          id: 99999,
        },
        mockContext,
      );

      const parsed = JSON.parse(result);

      expect(parsed.error).toBe('Not Found');
      expect(parsed.status).toBe(404);
      expect(parsed.message).toContain('Activity with ID 99999 not found');
      expect(mockContext.reportProgress).toHaveBeenCalled();
    });

    it('should handle 403 Forbidden error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
      } as Response);

      const result = await tool.getActivityDetail(
        {
          id: 12345,
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

      const result = await tool.getActivityDetail(
        {
          id: 12345,
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

      const result = await tool.getActivityDetail(
        {
          id: 12345,
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

      const result = await tool.getActivityDetail(
        {
          id: 12345,
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

    it('should report progress at correct intervals', async () => {
      const mockData = {
        id: 12345,
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
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
      } as Response);

      await tool.getActivityDetail(
        {
          id: 12345,
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
          RunalyzeActivityDetailTool,
          {
            provide: ConfigService,
            useValue: mockConfigServiceNoToken,
          },
        ],
      }).compile();

      const toolNoToken = module.get<RunalyzeActivityDetailTool>(RunalyzeActivityDetailTool);

      const result = await toolNoToken.getActivityDetail(
        {
          id: 12345,
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
