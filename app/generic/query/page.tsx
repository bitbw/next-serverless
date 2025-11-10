"use client";

import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type FilterOperator =
  | "="
  | "<>"
  | ">"
  | ">="
  | "<"
  | "<="
  | "LIKE"
  | "ILIKE"
  | "NOT LIKE"
  | "IN"
  | "IS NULL"
  | "IS NOT NULL";

interface Filter {
  id: string;
  field: string;
  operator: FilterOperator;
  value: string;
}

interface RequestState {
  apiUrl: string;
  tableName: string;
  filters: Filter[];
  logic: "AND" | "OR";
  orderBy: string;
  order: "ASC" | "DESC";
  limit: string;
  offset: string;
}

interface ResponseState {
  status: number;
  statusText: string;
  ok: boolean;
  duration: number;
  data: unknown;
  errorMessage?: string;
}

const operatorOptions: { value: FilterOperator; label: string }[] = [
  { value: "=", label: "equals (=)" },
  { value: "<>", label: "not equals (<>)" },
  { value: ">", label: "greater (>)" },
  { value: ">=", label: "greater or equals (>=)" },
  { value: "<", label: "less (<)" },
  { value: "<=", label: "less or equals (<=)" },
  { value: "LIKE", label: "like (LIKE)" },
  { value: "ILIKE", label: "ilike (ILIKE)" },
  { value: "NOT LIKE", label: "not like (NOT LIKE)" },
  { value: "IN", label: "in (IN)" },
  { value: "IS NULL", label: "is null (IS NULL)" },
  { value: "IS NOT NULL", label: "is not null (IS NOT NULL)" },
];

const defaultFilters: Omit<Filter, "id">[] = [
  { field: "type", operator: "=", value: "bumpy-map-record-point" },
  { field: "time", operator: ">=", value: "2025-11-03 11:01:00.000" },
  { field: "time", operator: "<=", value: "2025-11-03 11:14:00.000" },
];

const createFilterId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 10);
};

const buildRequestPayload = (state: RequestState) => {
  const filters = state.filters
    .map(({ field, operator, value }) => {
      const trimmedField = field.trim();
      if (!trimmedField) {
        return null;
      }

      let parsedValue: unknown = value.trim();

      if (operator === "IS NULL" || operator === "IS NOT NULL") {
        parsedValue = null;
      } else if (operator === "IN" && parsedValue) {
        parsedValue = String(parsedValue)
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      } else if (
        parsedValue &&
        operator !== "IN" &&
        !Number.isNaN(Number(parsedValue))
      ) {
        parsedValue = Number(parsedValue);
      }

      return {
        field: trimmedField,
        operator,
        value: parsedValue,
      };
    })
    .filter((filter): filter is NonNullable<typeof filter> => filter !== null);

  return {
    tableName: state.tableName.trim() || undefined,
    filters: filters.length > 0 ? filters : undefined,
    logic: state.logic,
    orderBy: state.orderBy.trim() || undefined,
    order: state.order,
    limit: state.limit ? Number(state.limit) : undefined,
    offset: state.offset ? Number(state.offset) : undefined,
  };
};

const defaultState: RequestState = {
  apiUrl: "http://localhost:3000",
  tableName: "FuxiData",
  filters: defaultFilters.map((filter) => ({
    ...filter,
    id: createFilterId(),
  })),
  logic: "AND",
  orderBy: "time",
  order: "DESC",
  limit: "20",
  offset: "0",
};

export default function GenericQueryPage() {
  const [state, setState] = useState<RequestState>(defaultState);
  const [response, setResponse] = useState<ResponseState | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 与静态 HTML 行为保持一致，进入页面自动加载默认数据
    setState(defaultState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestPayload = useMemo(() => buildRequestPayload(state), [state]);
  const requestJson = useMemo(
    () => JSON.stringify(requestPayload, null, 2),
    [requestPayload],
  );

  const handleStateChange = <K extends keyof RequestState>(
    key: K,
    value: RequestState[K],
  ) => {
    setState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFilterChange = (
    id: string,
    key: keyof Filter,
    value: Filter[keyof Filter],
  ) => {
    setState((prev) => ({
      ...prev,
      filters: prev.filters.map((filter) =>
        filter.id === id
          ? {
              ...filter,
              [key]: value,
            }
          : filter,
      ),
    }));
  };

  const addFilter = (preset?: Partial<Filter>) => {
    setState((prev) => ({
      ...prev,
      filters: [
        ...prev.filters,
        {
          id: createFilterId(),
          field: preset?.field ?? "",
          operator: preset?.operator ?? "=",
          value: preset?.value ?? "",
        },
      ],
    }));
  };

  const removeFilter = (id: string) => {
    setState((prev) => ({
      ...prev,
      filters: prev.filters.filter((filter) => filter.id !== id),
    }));
  };

  const resetToDefault = () => {
    setState({
      ...defaultState,
      filters: defaultFilters.map((filter) => ({
        ...filter,
        id: createFilterId(),
      })),
    });
    setResponse(null);
  };

  const clearResult = () => {
    setResponse(null);
  };

  const executeQuery = async () => {
    setIsLoading(true);
    setResponse(null);

    const url = `${state.apiUrl.replace(/\/$/, "")}/api/generic/query`;
    const startedAt = performance.now();

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      });

      const duration = Math.round(performance.now() - startedAt);
      let data: unknown = null;

      try {
        data = await res.json();
      } catch (error) {
        data = {
          message: "无法解析响应为 JSON",
          originalError: error instanceof Error ? error.message : String(error),
        };
      }

      setResponse({
        status: res.status,
        statusText: res.statusText,
        ok: res.ok,
        duration,
        data,
      });
    } catch (error) {
      const duration = Math.round(performance.now() - startedAt);

      setResponse({
        status: 0,
        statusText: "Network Error",
        ok: false,
        duration,
        data: null,
        errorMessage:
          error instanceof Error ? error.message : "未知网络错误，请稍后重试。",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const recordCount =
    response &&
    response.ok &&
    response.data &&
    typeof response.data === "object" &&
    response.data !== null &&
    "data" in response.data &&
    Array.isArray((response.data as { data?: unknown[] }).data)
      ? ((response.data as { data?: unknown[] }).data ?? []).length
      : null;

  const paginationInfo =
    response &&
    response.ok &&
    response.data &&
    typeof response.data === "object" &&
    response.data !== null &&
    "pagination" in response.data
      ? ((response.data as { pagination?: Record<string, unknown> })
          .pagination ?? null)
      : null;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">🧪 通用查询 API 测试工具</h1>
        <p className="text-muted-foreground">
          使用表单快速构建请求，测试 `POST /api/generic/query` 接口。
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>API 配置</CardTitle>
          <CardDescription>设置基础 API 地址。</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="api-url">API 基础 URL</Label>
            <Input
              id="api-url"
              value={state.apiUrl}
              placeholder="http://localhost:3000"
              onChange={(event) => handleStateChange("apiUrl", event.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>查询参数</CardTitle>
          <CardDescription>配置查询所需的字段与过滤条件。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="table-name">表名 (tableName)</Label>
            <Input
              id="table-name"
              value={state.tableName}
              placeholder="FuxiData"
              onChange={(event) =>
                handleStateChange("tableName", event.target.value)
              }
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>过滤条件 (filters)</Label>
                <p className="text-sm text-muted-foreground">
                  根据需要添加多个过滤条件，IN 操作符使用逗号分隔多个值。
                </p>
              </div>
              <Button type="button" variant="secondary" onClick={() => addFilter()}>
                + 添加过滤条件
              </Button>
            </div>

            {state.filters.length === 0 ? (
              <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
                当前没有过滤条件，点击上方按钮添加。
              </p>
            ) : (
              <div className="space-y-4">
                {state.filters.map((filter) => (
                  <Card key={filter.id} className="border border-dashed">
                    <CardContent className="grid gap-4 pt-6 md:grid-cols-3">
                      <div className="grid gap-2">
                        <Label>字段 (field)</Label>
                        <Input
                          value={filter.field}
                          placeholder="字段名"
                          onChange={(event) =>
                            handleFilterChange(
                              filter.id,
                              "field",
                              event.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>操作符 (operator)</Label>
                        <Select
                          value={filter.operator}
                          onValueChange={(value: FilterOperator) =>
                            handleFilterChange(filter.id, "operator", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="选择操作符" />
                          </SelectTrigger>
                          <SelectContent>
                            {operatorOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2 md:col-span-1">
                        <Label>值 (value)</Label>
                        <Input
                          value={filter.value}
                          placeholder="输入值，IN 使用逗号分隔"
                          disabled={
                            filter.operator === "IS NULL" ||
                            filter.operator === "IS NOT NULL"
                          }
                          onChange={(event) =>
                            handleFilterChange(
                              filter.id,
                              "value",
                              event.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="md:col-span-3">
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => removeFilter(filter.id)}
                        >
                          删除
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="logic">逻辑关系 (logic)</Label>
              <Select
                value={state.logic}
                onValueChange={(value: "AND" | "OR") =>
                  handleStateChange("logic", value)
                }
              >
                <SelectTrigger id="logic">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AND">AND</SelectItem>
                  <SelectItem value="OR">OR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="order">排序方向 (order)</Label>
              <Select
                value={state.order}
                onValueChange={(value: "ASC" | "DESC") =>
                  handleStateChange("order", value)
                }
              >
                <SelectTrigger id="order">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DESC">DESC</SelectItem>
                  <SelectItem value="ASC">ASC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="order-by">排序字段 (orderBy)</Label>
              <Input
                id="order-by"
                value={state.orderBy}
                placeholder="time"
                onChange={(event) =>
                  handleStateChange("orderBy", event.target.value)
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="limit">限制数量 (limit)</Label>
              <Input
                id="limit"
                type="number"
                value={state.limit}
                placeholder="20"
                onChange={(event) =>
                  handleStateChange("limit", event.target.value)
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="offset">偏移量 (offset)</Label>
              <Input
                id="offset"
                type="number"
                value={state.offset}
                placeholder="0"
                onChange={(event) =>
                  handleStateChange("offset", event.target.value)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>操作</CardTitle>
          <CardDescription>执行测试或重置默认参数。</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button onClick={executeQuery} disabled={isLoading}>
            {isLoading ? "请求中..." : "🚀 执行测试"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={resetToDefault}
            disabled={isLoading}
          >
            📋 加载默认测试数据
          </Button>
          <Button type="button" variant="secondary" onClick={clearResult}>
            🗑️ 清除结果
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>请求 JSON</CardTitle>
            <CardDescription>该请求会发送到 API。</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              className="min-h-[260px] font-mono text-sm"
              value={requestJson}
              readOnly
            />
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <CardTitle>响应结果</CardTitle>
            <CardDescription>显示最新一次请求的响应内容。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {response ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-base font-semibold">
                    状态: {response.status} {response.statusText}
                  </span>
                  <Badge
                    className={cn(
                      "text-sm",
                      response.ok
                        ? "bg-emerald-500 hover:bg-emerald-500"
                        : "bg-destructive hover:bg-destructive",
                    )}
                  >
                    {response.ok ? "成功" : "失败"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    响应时间: {response.duration}ms
                  </span>
                  {recordCount !== null && (
                    <span className="text-sm text-muted-foreground">
                      记录数: {recordCount}
                    </span>
                  )}
                </div>

                {paginationInfo && typeof paginationInfo === "object" && (
                  <div className="rounded-md border bg-muted/50 p-4 text-sm">
                    <p className="font-medium">分页信息:</p>
                    <div className="mt-2 space-y-1 text-muted-foreground">
                      {"total" in paginationInfo && (
                        <p>总数: {String(paginationInfo.total)}</p>
                      )}
                      {"limit" in paginationInfo && (
                        <p>限制: {String(paginationInfo.limit)}</p>
                      )}
                      {"offset" in paginationInfo && (
                        <p>偏移: {String(paginationInfo.offset)}</p>
                      )}
                      {"hasMore" in paginationInfo && (
                        <p>
                          还有更多:{" "}
                          {String((paginationInfo as { hasMore?: boolean }).hasMore
                            ? "是"
                            : "否")}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {response.errorMessage && (
                  <div className="rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
                    {response.errorMessage}
                  </div>
                )}

                <Textarea
                  className="min-h-[260px] font-mono text-sm"
                  value={JSON.stringify(response.data, null, 2)}
                  readOnly
                />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                暂无响应结果，执行测试后展示返回数据。
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

