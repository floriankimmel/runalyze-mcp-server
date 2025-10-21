import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { RunalyzeHrvTool } from '../runalyze-hrv.tool';

describe('RunalyzeHrvTool', () => {
  let tool: RunalyzeHrvTool;
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
        RunalyzeHrvTool,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    tool = module.get<RunalyzeHrvTool>(RunalyzeHrvTool);

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

  describe('getHrvData', () => {
    it('should successfully retrieve HRV data', async () => {
      const mockData = [
        {
          id: 1,
          date_time: '2024-01-01T08:00:00Z',
          metric: '65',
          measurement_type: 'rmssd',
        },
        {
          id: 2,
          date_time: '2024-01-02T08:00:00Z',
          metric: '72',
          measurement_type: 'rmssd',
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
      } as Response);

      const result = await tool.getHrvData(
        {
          page: 1,
        },
        mockContext,
      );

      const parsed = JSON.parse(result);

      expect(parsed.data).toEqual(mockData);
      expect(parsed.page).toBe(1);
      expect(parsed.totalItems).toBe(2);
      expect(mockFetch).toHaveBeenCalledWith('https://runalyze.com/api/v1/metrics/hrv?page=1', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer test-token',
        },
      });
      expect(mockContext.reportProgress).toHaveBeenCalledTimes(4);
    });

    it('should handle pagination parameter', async () => {
      const mockData = [
        {
          id: 3,
          date_time: '2024-01-03T08:00:00Z',
          metric: '68',
          measurement_type: 'rmssd',
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
      } as Response);

      await tool.getHrvData(
        {
          page: 3,
        },
        mockContext,
      );

      expect(mockFetch).toHaveBeenCalledWith(
        'https://runalyze.com/api/v1/metrics/hrv?page=3',
        expect.any(Object),
      );
    });

    it('should handle 403 Forbidden error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
      } as Response);

      const result = await tool.getHrvData(
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

      const result = await tool.getHrvData(
        {
          page: 1,
        },
        mockContext,
      );

      const parsed = JSON.parse(result);

      expect(parsed.error).toBe('Unauthorized');
      expect(parsed.status).toBe(401);
      expect(parsed.message).toContain('Invalid API token');
    });

    it('should handle other HTTP errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response);

      const result = await tool.getHrvData(
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

      const result = await tool.getHrvData(
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

      const result = await tool.getHrvData(
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
          date_time: '2024-01-01T08:00:00Z',
          metric: '65',
          measurement_type: 'rmssd',
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
      } as Response);

      await tool.getHrvData(
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
          RunalyzeHrvTool,
          {
            provide: ConfigService,
            useValue: mockConfigServiceNoToken,
          },
        ],
      }).compile();

      const toolNoToken = module.get<RunalyzeHrvTool>(RunalyzeHrvTool);

      const result = await toolNoToken.getHrvData(
        {
          page: 1,
        },
        mockContext,
      );

      const parsed = JSON.parse(result);

      expect(parsed.error).toBe('Configuration Error');
      expect(parsed.message).toContain('RUNALYZE_API_TOKEN is not configured');
      expect(parsed.instructions).toBeDefined();
    });
  });
});
