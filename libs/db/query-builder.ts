/**
 * 查询构建工具
 * 将请求参数转换为 SQL 查询参数
 */

export interface Filter {
  field: string;
  operator: 
    | '=' 
    | '<>' 
    | '>' 
    | '>=' 
    | '<' 
    | '<=' 
    | 'LIKE' 
    | 'ILIKE' 
    | 'NOT LIKE' 
    | 'IN' 
    | 'IS NULL' 
    | 'IS NOT NULL';
  value: any;
}

export interface QueryParams {
  tableName?: string;
  filters?: Filter[];
  logic?: 'AND' | 'OR';
  orderBy?: string;
  order?: 'ASC' | 'DESC';
  limit?: number;
  offset?: number;
}

export interface SqlQueryResult {
  query: string;
  params: any[];
}

/**
 * 构建 WHERE 子句（用于查询和计数）
 */
function buildWhereClause(
  filters: Filter[],
  logic: 'AND' | 'OR',
  queryParams: any[],
  startParamIndex: number = 1
): { clause: string; nextParamIndex: number } {
  if (filters.length === 0) {
    return { clause: '', nextParamIndex: startParamIndex };
  }

  const whereConditions: string[] = [];
  let paramIndex = startParamIndex;

  filters.forEach((filter) => {
    const { field, operator, value } = filter;
    const escapedField = `"${field}"`;

    switch (operator) {
      case 'IS NULL':
      case 'IS NOT NULL':
        // NULL 检查不需要参数
        whereConditions.push(`${escapedField} ${operator}`);
        break;

      case 'IN':
        // IN 操作符需要处理数组
        if (Array.isArray(value)) {
          const placeholders = value.map(() => `$${paramIndex++}`).join(', ');
          queryParams.push(...value);
          whereConditions.push(`${escapedField} IN (${placeholders})`);
        } else {
          // 单个值也支持
          queryParams.push(value);
          whereConditions.push(`${escapedField} IN ($${paramIndex++})`);
        }
        break;

      case 'LIKE':
      case 'ILIKE':
      case 'NOT LIKE':
        // LIKE 操作符
        queryParams.push(value);
        whereConditions.push(`${escapedField} ${operator} $${paramIndex++}`);
        break;

      default:
        // 其他操作符 (=, <>, >, >=, <, <=)
        queryParams.push(value);
        whereConditions.push(`${escapedField} ${operator} $${paramIndex++}`);
        break;
    }
  });

  const clause = whereConditions.length > 0
    ? `WHERE ${whereConditions.join(` ${logic} `)}`
    : '';

  return { clause, nextParamIndex: paramIndex };
}

/**
 * 将查询参数转换为 SQL 查询字符串和参数数组
 * @param params 查询参数
 * @param forCount 是否构建 COUNT 查询
 * @returns SQL 查询字符串和参数数组
 */
export function buildQuery(params: QueryParams, forCount: boolean = false): SqlQueryResult {
  const {
    tableName = 'FuxiData',
    filters = [],
    logic = 'AND',
    orderBy,
    order = 'DESC',
    limit,
    offset,
  } = params;

  const queryParts: string[] = [];
  const queryParams: any[] = [];
  let paramIndex = 1;

  // 构建 SELECT 语句
  if (forCount) {
    queryParts.push(`SELECT COUNT(*) as total FROM "${tableName}"`);
  } else {
    queryParts.push(`SELECT * FROM "${tableName}"`);
  }

  // 构建 WHERE 子句
  const { clause: whereClause, nextParamIndex } = buildWhereClause(
    filters,
    logic,
    queryParams,
    paramIndex
  );
  paramIndex = nextParamIndex;

  if (whereClause) {
    queryParts.push(whereClause);
  }

  // COUNT 查询不需要 ORDER BY、LIMIT 和 OFFSET
  if (!forCount) {
    // 构建 ORDER BY 子句
    if (orderBy) {
      const escapedOrderBy = `"${orderBy}"`;
      queryParts.push(`ORDER BY ${escapedOrderBy} ${order}`);
    }

    // 构建 LIMIT 子句
    if (limit !== undefined && limit !== null) {
      queryParams.push(limit);
      queryParts.push(`LIMIT $${paramIndex++}`);
    }

    // 构建 OFFSET 子句
    if (offset !== undefined && offset !== null) {
      queryParams.push(offset);
      queryParts.push(`OFFSET $${paramIndex++}`);
    }
  }

  const query = queryParts.join(' ');

  return {
    query,
    params: queryParams,
  };
}

