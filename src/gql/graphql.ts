/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /**
   * Implement the DateTime<Utc> scalar
   *
   * The input/output is a string in RFC3339 format.
   */
  DateTime: { input: any; output: any; }
  /** A scalar that can represent any JSON value. */
  JSON: { input: any; output: any; }
};

/** Activity Log GraphQL type */
export type ActivityLog = {
  __typename?: 'ActivityLog';
  activityType: ActivityType;
  actorId?: Maybe<Scalars['Int']['output']>;
  actorType?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  severity: Severity;
  targetId?: Maybe<Scalars['Int']['output']>;
  targetType?: Maybe<Scalars['String']['output']>;
};

export type ActivityLogQuery = {
  __typename?: 'ActivityLogQuery';
  /** Get activity log by ID */
  activityLog?: Maybe<ActivityLog>;
  /** Get all activity logs with optional pagination */
  activityLogs: Array<ActivityLog>;
  /** Get activity logs by action type */
  activityLogsByAction: Array<ActivityLog>;
  /** Get activity logs within a date range */
  activityLogsByDateRange: Array<ActivityLog>;
  /** Get activity logs for a specific entity */
  activityLogsByEntity: Array<ActivityLog>;
  /** Get activity logs for a specific user */
  activityLogsByUser: Array<ActivityLog>;
  /** Get activity summary for a time period */
  activitySummary?: Maybe<ActivitySummary>;
  /** Get critical activity logs */
  criticalLogs: Array<ActivityLog>;
  /** Get error activity logs */
  errorLogs: Array<ActivityLog>;
  /** Get recent activity logs */
  recentActivity: Array<ActivityLog>;
  /** Get user activity statistics */
  userActivityStats?: Maybe<UserActivityStats>;
};


export type ActivityLogQueryActivityLogArgs = {
  id: Scalars['String']['input'];
};


export type ActivityLogQueryActivityLogsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type ActivityLogQueryActivityLogsByActionArgs = {
  action: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type ActivityLogQueryActivityLogsByDateRangeArgs = {
  end: Scalars['DateTime']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  start: Scalars['DateTime']['input'];
};


export type ActivityLogQueryActivityLogsByEntityArgs = {
  entityId: Scalars['String']['input'];
  entityType: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type ActivityLogQueryActivityLogsByUserArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  userId: Scalars['String']['input'];
};


export type ActivityLogQueryActivitySummaryArgs = {
  end: Scalars['DateTime']['input'];
  start: Scalars['DateTime']['input'];
};


export type ActivityLogQueryCriticalLogsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type ActivityLogQueryErrorLogsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type ActivityLogQueryRecentActivityArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type ActivityLogQueryUserActivityStatsArgs = {
  userId: Scalars['String']['input'];
};

export type ActivitySummary = {
  __typename?: 'ActivitySummary';
  criticalCount: Scalars['Int']['output'];
  errorCount: Scalars['Int']['output'];
  totalCount: Scalars['Int']['output'];
};

/** Activity type enum - matches domain */
export enum ActivityType {
  ApiAccess = 'API_ACCESS',
  CartAbandoned = 'CART_ABANDONED',
  CartConverted = 'CART_CONVERTED',
  CartCreated = 'CART_CREATED',
  CartUpdated = 'CART_UPDATED',
  ErrorOccurred = 'ERROR_OCCURRED',
  OrderCancelled = 'ORDER_CANCELLED',
  OrderCreated = 'ORDER_CREATED',
  OrderDelivered = 'ORDER_DELIVERED',
  OrderPaid = 'ORDER_PAID',
  OrderShipped = 'ORDER_SHIPPED',
  OrderUpdated = 'ORDER_UPDATED',
  PasswordChange = 'PASSWORD_CHANGE',
  PaymentCompleted = 'PAYMENT_COMPLETED',
  PaymentFailed = 'PAYMENT_FAILED',
  PaymentInitiated = 'PAYMENT_INITIATED',
  ProductAdded = 'PRODUCT_ADDED',
  ProductRemoved = 'PRODUCT_REMOVED',
  ProductViewed = 'PRODUCT_VIEWED',
  RefundCompleted = 'REFUND_COMPLETED',
  RefundInitiated = 'REFUND_INITIATED',
  SettingsUpdated = 'SETTINGS_UPDATED',
  SystemEvent = 'SYSTEM_EVENT',
  UserLogin = 'USER_LOGIN',
  UserLogout = 'USER_LOGOUT',
  UserProfileUpdate = 'USER_PROFILE_UPDATE',
  UserRegistration = 'USER_REGISTRATION'
}

/** Input for adding an item to cart */
export type AddCartItemInput = {
  cartId: Scalars['Int']['input'];
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  productName: Scalars['String']['input'];
  quantity: Scalars['Int']['input'];
  satelliteName?: InputMaybe<Scalars['String']['input']>;
  unitPrice: Scalars['Float']['input'];
};

export type AnalysisResultGraphQl = {
  __typename?: 'AnalysisResultGraphQL';
  coordinates?: Maybe<Scalars['JSON']['output']>;
  id: Scalars['String']['output'];
  imageData?: Maybe<ImageAssetGraphQl>;
  name: Scalars['String']['output'];
  timestamp: Scalars['Int']['output'];
  value: Scalars['Float']['output'];
};

export type AuthMutation = {
  __typename?: 'AuthMutation';
  /** Change password for authenticated user with current password verification */
  changePassword: Scalars['Boolean']['output'];
  /** Login with Google OAuth */
  googleLogin: AuthResponse;
  /** Login with email and password */
  login: AuthResponse;
  /** Logout (invalidate session) */
  logout: Scalars['Boolean']['output'];
  /** Refresh access token using refresh token */
  refreshToken: AuthResponse;
  /** Register a new user */
  register: AuthResponse;
  /** Request password reset email */
  requestPasswordReset: Scalars['Boolean']['output'];
  /** Reset password with token from email */
  resetPassword: AuthResponse;
  /** Set password for authenticated user (e.g., Google user setting password after login) */
  setPassword: Scalars['Boolean']['output'];
  /** Verify email with verification token */
  verifyEmail: Scalars['Boolean']['output'];
};


export type AuthMutationChangePasswordArgs = {
  confirmPassword: Scalars['String']['input'];
  currentPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};


export type AuthMutationGoogleLoginArgs = {
  input: GoogleLoginInput;
};


export type AuthMutationLoginArgs = {
  input: LoginInput;
};


export type AuthMutationRefreshTokenArgs = {
  refreshToken: Scalars['String']['input'];
};


export type AuthMutationRegisterArgs = {
  input: CreateUserInput;
};


export type AuthMutationRequestPasswordResetArgs = {
  email: Scalars['String']['input'];
};


export type AuthMutationResetPasswordArgs = {
  confirmPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
  token: Scalars['String']['input'];
};


export type AuthMutationSetPasswordArgs = {
  confirmPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};


export type AuthMutationVerifyEmailArgs = {
  token: Scalars['String']['input'];
};

export type AuthQuery = {
  __typename?: 'AuthQuery';
  /** Check if a token is valid */
  isTokenValid: Scalars['Boolean']['output'];
  /** Get current authenticated user */
  me?: Maybe<User>;
  /** Get token expiration info */
  tokenExpiration: Scalars['Int']['output'];
};


export type AuthQueryIsTokenValidArgs = {
  token: Scalars['String']['input'];
};


export type AuthQueryTokenExpirationArgs = {
  token: Scalars['String']['input'];
};

/** Authentication response for login attempts */
export type AuthResponse = {
  __typename?: 'AuthResponse';
  /** Error message if authentication failed */
  error?: Maybe<Scalars['String']['output']>;
  /** Token expiration time in seconds */
  expiresIn: Scalars['Int']['output'];
  /** Refresh token for renewing access */
  refreshToken?: Maybe<Scalars['String']['output']>;
  /** Whether authentication was successful */
  success: Scalars['Boolean']['output'];
  /** Access token for API requests */
  token?: Maybe<Scalars['String']['output']>;
  /** Token type (always "Bearer") */
  tokenType: Scalars['String']['output'];
  /** Current user info if authenticated */
  user?: Maybe<User>;
};

export type BoundingBoxGraphQl = {
  __typename?: 'BoundingBoxGraphQL';
  maxLat: Scalars['Float']['output'];
  maxLng: Scalars['Float']['output'];
  minLat: Scalars['Float']['output'];
  minLng: Scalars['Float']['output'];
};

/** Input for cancelling an Order */
export type CancelOrderInput = {
  reason?: InputMaybe<Scalars['String']['input']>;
};

/** Cart GraphQL type */
export type Cart = {
  __typename?: 'Cart';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  items: Array<CartItem>;
  sessionId?: Maybe<Scalars['String']['output']>;
  status: CartStatus;
  totalAmount: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId?: Maybe<Scalars['Int']['output']>;
};

export type CartConversionResult = {
  __typename?: 'CartConversionResult';
  amount?: Maybe<Scalars['Float']['output']>;
  chargeId?: Maybe<Scalars['String']['output']>;
  expiresAt?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  orderId?: Maybe<Scalars['Int']['output']>;
  paymentRequired: Scalars['Boolean']['output'];
  qrCodeUrl?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

/** Cart item in the GraphQL schema */
export type CartItem = {
  __typename?: 'CartItem';
  cartId: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  productName: Scalars['String']['output'];
  quantity: Scalars['Int']['output'];
  satelliteName?: Maybe<Scalars['String']['output']>;
  unitPrice: Scalars['Float']['output'];
};

export type CartMutation = {
  __typename?: 'CartMutation';
  /** Add an item to cart */
  addCartItem: Cart;
  /** Clear all items from cart */
  clearCart: Cart;
  /** Convert cart to order (checkout) */
  convertCartToOrder: CartConversionResult;
  /** Create a new cart (for user or guest) */
  createCart: Cart;
  /** Remove an item from cart */
  removeCartItem: Cart;
  /** Update cart item quantity */
  updateCartItem: Cart;
};


export type CartMutationAddCartItemArgs = {
  input: AddCartItemInput;
};


export type CartMutationClearCartArgs = {
  id: Scalars['String']['input'];
};


export type CartMutationConvertCartToOrderArgs = {
  input: ConvertCartToOrderInput;
};


export type CartMutationCreateCartArgs = {
  input: CreateCartInput;
};


export type CartMutationRemoveCartItemArgs = {
  input: RemoveCartItemInput;
};


export type CartMutationUpdateCartItemArgs = {
  input: UpdateCartItemInput;
};

export type CartQuery = {
  __typename?: 'CartQuery';
  /** Get active cart for user */
  activeCart?: Maybe<Cart>;
  /** Get cart by ID */
  cart?: Maybe<Cart>;
  /** Get cart by session ID (for guest carts) */
  cartBySession?: Maybe<Cart>;
  /** Get all carts with optional pagination */
  carts: Array<Cart>;
  /** Get user's cart history */
  myCartHistory: Array<CartSummary>;
};


export type CartQueryActiveCartArgs = {
  userId: Scalars['String']['input'];
};


export type CartQueryCartArgs = {
  id: Scalars['String']['input'];
};


export type CartQueryCartBySessionArgs = {
  sessionId: Scalars['String']['input'];
};


export type CartQueryCartsArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


export type CartQueryMyCartHistoryArgs = {
  userId: Scalars['String']['input'];
};

/** Cart status enum - matches domain */
export enum CartStatus {
  Abandoned = 'ABANDONED',
  Active = 'ACTIVE',
  Converted = 'CONVERTED',
  Expired = 'EXPIRED'
}

export type CartSummary = {
  __typename?: 'CartSummary';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  itemCount: Scalars['Int']['output'];
  status: CartStatus;
  totalAmount: Scalars['Float']['output'];
  userId?: Maybe<Scalars['Int']['output']>;
};

/** Input for converting cart to order */
export type ConvertCartToOrderInput = {
  billingAddress?: InputMaybe<Scalars['String']['input']>;
  cartId: Scalars['Int']['input'];
  /** URL to redirect after payment completion (for Omise) */
  returnUrl?: InputMaybe<Scalars['String']['input']>;
  shippingAddress?: InputMaybe<Scalars['String']['input']>;
};

/** Input for creating a new Cart */
export type CreateCartInput = {
  sessionId?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
};

/** Input for creating a new Order */
export type CreateOrderInput = {
  billingAddress?: InputMaybe<ShippingAddressInput>;
  items: Array<OrderItemInput>;
  notes?: InputMaybe<Scalars['String']['input']>;
  shippingAddress: ShippingAddressInput;
  userId: Scalars['Int']['input'];
};

/** Input for creating a new User */
export type CreateUserInput = {
  email: Scalars['String']['input'];
  fullName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  role?: InputMaybe<Scalars['String']['input']>;
};

export type FeatureStatisticsGraphQl = {
  __typename?: 'FeatureStatisticsGraphQL';
  boundingBox: BoundingBoxGraphQl;
  pointCount: Scalars['Int']['output'];
};

/** Filter expression input (STAC filter extension) */
export type FilterExpressionInput = {
  /** Arguments for the operation */
  args: Array<Scalars['JSON']['input']>;
  /** Logical operator: "and", "or", "eq", "lt", "lte", "gt", "gte", etc. */
  op: Scalars['String']['input'];
};

/** GeoJSON Geometry input */
export type GeoJsonGeometryInput = {
  /** Coordinates array */
  coordinates: Scalars['JSON']['input'];
  /** Geometry type (Polygon, LineString, Point, etc.) */
  type: Scalars['String']['input'];
};

/** Input for Google OAuth login/authentication */
export type GoogleLoginInput = {
  email: Scalars['String']['input'];
  first_name: Scalars['String']['input'];
  google_id: Scalars['String']['input'];
};

export type ImageAssetGraphQl = {
  __typename?: 'ImageAssetGraphQL';
  downloadUrl?: Maybe<Scalars['String']['output']>;
  thumbnailUrl?: Maybe<Scalars['String']['output']>;
};

/** Input for user login/authentication */
export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type MutationRoot = {
  __typename?: 'MutationRoot';
  addCartItem: Cart;
  cancelOrder: OrderMutation;
  changePassword: AuthMutation;
  convertCartToOrder: CartConversionResult;
  /** Create cart mutation */
  createCart: Cart;
  /** Delegate to order mutations */
  createOrder: OrderMutation;
  /** Delegate to user mutations */
  createUser: UserMutation;
  deleteUser: UserMutation;
  /** Delegate to auth mutations */
  login: AuthMutation;
  logout: AuthMutation;
  refreshToken: AuthMutation;
  register: AuthMutation;
  removeCartItem: Cart;
  requestPasswordReset: AuthMutation;
  resetPassword: AuthMutation;
  updateCartItem: CartMutation;
  updateOrder: OrderMutation;
  updateUser: UserMutation;
  verifyEmail: AuthMutation;
};


export type MutationRootAddCartItemArgs = {
  input: AddCartItemInput;
};


export type MutationRootConvertCartToOrderArgs = {
  input: ConvertCartToOrderInput;
};


export type MutationRootCreateCartArgs = {
  input: CreateCartInput;
};


export type MutationRootRemoveCartItemArgs = {
  input: RemoveCartItemInput;
};

/** Order GraphQL type */
export type Order = {
  __typename?: 'Order';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  items: Array<OrderItem>;
  paidAt?: Maybe<Scalars['DateTime']['output']>;
  status: OrderStatus;
  totalAmount: Scalars['Float']['output'];
  totalItems: Scalars['Int']['output'];
  userId: Scalars['Int']['output'];
};

/** Order item in the GraphQL schema */
export type OrderItem = {
  __typename?: 'OrderItem';
  createdAt: Scalars['DateTime']['output'];
  dataPointId: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  itemName: Scalars['String']['output'];
  orderId: Scalars['Int']['output'];
  price: Scalars['Float']['output'];
};

/** Order item input */
export type OrderItemInput = {
  discount?: InputMaybe<Scalars['Float']['input']>;
  productId: Scalars['Int']['input'];
  productName: Scalars['String']['input'];
  quantity: Scalars['Int']['input'];
  unitPrice: Scalars['Float']['input'];
};

export type OrderMutation = {
  __typename?: 'OrderMutation';
  /** Add note to order */
  addOrderNote: Order;
  /** Add tracking information to an order */
  addTrackingInfo: Order;
  /** Cancel an order */
  cancelOrder: Order;
  /** Confirm an order (transition from Pending to Confirmed) */
  confirmOrder: Order;
  /** Create a new order */
  createOrder: Order;
  /** Mark order as delivered */
  deliverOrder: Order;
  /** Mark order as paid */
  payOrder: Order;
  /** Process a refund */
  refundOrder: Order;
  /** Ship an order */
  shipOrder: Order;
  /** Update an existing order */
  updateOrder: Order;
};


export type OrderMutationAddOrderNoteArgs = {
  id: Scalars['String']['input'];
  note: Scalars['String']['input'];
};


export type OrderMutationAddTrackingInfoArgs = {
  carrier?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  trackingNumber: Scalars['String']['input'];
};


export type OrderMutationCancelOrderArgs = {
  id: Scalars['String']['input'];
  input: CancelOrderInput;
};


export type OrderMutationConfirmOrderArgs = {
  id: Scalars['String']['input'];
};


export type OrderMutationCreateOrderArgs = {
  input: CreateOrderInput;
};


export type OrderMutationDeliverOrderArgs = {
  id: Scalars['String']['input'];
};


export type OrderMutationPayOrderArgs = {
  id: Scalars['String']['input'];
  paymentId?: InputMaybe<Scalars['String']['input']>;
};


export type OrderMutationRefundOrderArgs = {
  amount?: InputMaybe<Scalars['Float']['input']>;
  id: Scalars['String']['input'];
};


export type OrderMutationShipOrderArgs = {
  carrier?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  trackingNumber?: InputMaybe<Scalars['String']['input']>;
};


export type OrderMutationUpdateOrderArgs = {
  id: Scalars['String']['input'];
  input: UpdateOrderInput;
};

/** Pagination input for order queries */
export type OrderPaginationInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
};

export type OrderQuery = {
  __typename?: 'OrderQuery';
  /** Get order by ID */
  order?: Maybe<Order>;
  /** Get order count by status */
  orderCountByStatus: Array<OrderStatusCount>;
  /** Get order with all items by ID */
  orderWithItems?: Maybe<OrderWithItems>;
  /** Get all orders with optional pagination */
  orders: Array<Order>;
  /** Get orders by status */
  ordersByStatus: Array<Order>;
  /** Get orders by user ID */
  ordersByUser: Array<Order>;
  /** Get recent orders (for dashboard) */
  recentOrders: Array<Order>;
};


export type OrderQueryOrderArgs = {
  id: Scalars['String']['input'];
};


export type OrderQueryOrderWithItemsArgs = {
  id: Scalars['String']['input'];
};


export type OrderQueryOrdersArgs = {
  pagination?: InputMaybe<OrderPaginationInput>;
};


export type OrderQueryOrdersByStatusArgs = {
  pagination?: InputMaybe<OrderPaginationInput>;
  status: OrderStatus;
};


export type OrderQueryOrdersByUserArgs = {
  pagination?: InputMaybe<OrderPaginationInput>;
  userId: Scalars['String']['input'];
};


export type OrderQueryRecentOrdersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};

/** Order status enum - matches domain */
export enum OrderStatus {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Paid = 'PAID',
  Pending = 'PENDING',
  Processing = 'PROCESSING'
}

/** Order status count for statistics */
export type OrderStatusCount = {
  __typename?: 'OrderStatusCount';
  count: Scalars['Int']['output'];
  status: OrderStatus;
};

export type OrderWithItems = {
  __typename?: 'OrderWithItems';
  items: Array<OrderItem>;
  order: Order;
};

/** Pagination input for list queries */
export type PaginationInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryRoot = {
  __typename?: 'QueryRoot';
  /** Get a specific activity log by ID */
  activityLog: ActivityLogQuery;
  /** Delegate to activity log queries */
  activityLogs: ActivityLogQuery;
  /** Get a specific cart by ID */
  cart: CartQuery;
  /** Delegate to cart queries */
  carts: CartQuery;
  /** Health check query */
  health: Scalars['String']['output'];
  /** Auth queries */
  me: AuthQuery;
  /** Get a specific order by ID */
  order: OrderQuery;
  /** Delegate to order queries */
  orders: OrderQuery;
  /** STAC search query - directly returns result */
  stacSearch: TransformedApiResponseGraphQl;
  /** Get current server time */
  time: Scalars['String']['output'];
  /** Get a specific user by ID */
  user: UserQuery;
  /** Delegate to user queries */
  users: UserQuery;
  /** API version */
  version: Scalars['String']['output'];
};


export type QueryRootStacSearchArgs = {
  input: StacSearchInput;
};

/** Input for removing an item from cart */
export type RemoveCartItemInput = {
  cartId: Scalars['Int']['input'];
  itemId: Scalars['Int']['input'];
};

/** Severity level enum - matches domain */
export enum Severity {
  Critical = 'CRITICAL',
  Debug = 'DEBUG',
  Error = 'ERROR',
  Info = 'INFO',
  Warning = 'WARNING'
}

export type ShapeAnalysisGraphQl = {
  __typename?: 'ShapeAnalysisGraphQL';
  area: Scalars['Float']['output'];
  centroid: Array<Scalars['Float']['output']>;
  perimeter: Scalars['Float']['output'];
  type: Scalars['String']['output'];
};

/** Shipping address input */
export type ShippingAddressInput = {
  city: Scalars['String']['input'];
  country: Scalars['String']['input'];
  name: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  postalCode: Scalars['String']['input'];
  state: Scalars['String']['input'];
  street: Scalars['String']['input'];
};

/** STAC Search input - maps to STAC API search parameters */
export type StacSearchInput = {
  /** Bounding box [minX, minY, maxX, maxY] */
  bbox?: InputMaybe<Array<Scalars['Float']['input']>>;
  /** Collections to search */
  collections?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Cursor for pagination */
  cursor?: InputMaybe<Scalars['String']['input']>;
  /** DateTime filter (e.g., "2020-01-01T00:00:00Z/2020-12-31T23:59:59Z") */
  datetime?: InputMaybe<Scalars['String']['input']>;
  /** Filter expression (STAC filter extension) */
  filter?: InputMaybe<FilterExpressionInput>;
  /** GeoJSON intersect geometry (Polygon, LineString, etc.) */
  intersects?: InputMaybe<GeoJsonGeometryInput>;
  /** Maximum number of results */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Pagination offset */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** Sort field (e.g., "-datetime" for descending) */
  sortby?: InputMaybe<Scalars['String']['input']>;
  /** STAC API type(s) to use: "theos2", "sentinel", "landsat" (can pass multiple) */
  stacType?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type TransformedApiResponseGraphQl = {
  __typename?: 'TransformedApiResponseGraphQL';
  data?: Maybe<TransformedDataGraphQl>;
  error?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type TransformedDataGraphQl = {
  __typename?: 'TransformedDataGraphQL';
  results: Array<AnalysisResultGraphQl>;
  shapeAnalysis: ShapeAnalysisGraphQl;
  statistics: FeatureStatisticsGraphQl;
};

/** Input for updating a cart item */
export type UpdateCartItemInput = {
  cartId: Scalars['Int']['input'];
  itemId: Scalars['Int']['input'];
  quantity: Scalars['Int']['input'];
};

/** Input for updating an existing Order */
export type UpdateOrderInput = {
  billingAddress?: InputMaybe<ShippingAddressInput>;
  notes?: InputMaybe<Scalars['String']['input']>;
  shippingAddress?: InputMaybe<ShippingAddressInput>;
  status?: InputMaybe<Scalars['String']['input']>;
  trackingNumber?: InputMaybe<Scalars['String']['input']>;
};

/** Input for updating an existing User */
export type UpdateUserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  fullName?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
};

/**
 * UserGraphQL represents a User entity in the GraphQL schema
 *
 * SECURITY: This type deliberately excludes password_hash field.
 * Passwords must NEVER be exposed through the API.
 */
export type User = {
  __typename?: 'User';
  /** When the user was created */
  createdAt: Scalars['DateTime']['output'];
  /** Get a display-friendly representation of the user */
  displayName: Scalars['String']['output'];
  /** User email address */
  email: Scalars['String']['output'];
  /** User's full name */
  fullName: Scalars['String']['output'];
  /** Unique user identifier */
  id: Scalars['Int']['output'];
  /** Check if user is an admin */
  isAdmin: Scalars['Boolean']['output'];
  /** Check if user is a manager */
  isManager: Scalars['Boolean']['output'];
  /** User role */
  role: UserRole;
  /** When the user was last updated */
  updatedAt: Scalars['DateTime']['output'];
};

export type UserActivityStats = {
  __typename?: 'UserActivityStats';
  lastActivity?: Maybe<Scalars['DateTime']['output']>;
  totalActivities: Scalars['Int']['output'];
  userId: Scalars['Int']['output'];
};

export type UserMutation = {
  __typename?: 'UserMutation';
  /** Change user password */
  changePassword: Scalars['Boolean']['output'];
  /** Create a new user */
  createUser: User;
  /** Delete a user (soft delete by setting inactive) */
  deleteUser: Scalars['Boolean']['output'];
  /** Reset password (forgot password flow) */
  resetPassword: Scalars['Boolean']['output'];
  /** Update an existing user */
  updateUser: User;
};


export type UserMutationChangePasswordArgs = {
  currentPassword: Scalars['String']['input'];
  id: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};


export type UserMutationCreateUserArgs = {
  input: CreateUserInput;
};


export type UserMutationDeleteUserArgs = {
  id: Scalars['String']['input'];
};


export type UserMutationResetPasswordArgs = {
  email: Scalars['String']['input'];
};


export type UserMutationUpdateUserArgs = {
  id: Scalars['String']['input'];
  input: UpdateUserInput;
};

export type UserQuery = {
  __typename?: 'UserQuery';
  /** Check if email is available */
  isEmailAvailable: Scalars['Boolean']['output'];
  /** Get current authenticated user */
  me?: Maybe<User>;
  /** Get user by ID */
  user?: Maybe<User>;
  /** Get user by email */
  userByEmail?: Maybe<User>;
  /** Get all users with optional pagination */
  users: Array<User>;
};


export type UserQueryIsEmailAvailableArgs = {
  email: Scalars['String']['input'];
};


export type UserQueryUserArgs = {
  id: Scalars['String']['input'];
};


export type UserQueryUserByEmailArgs = {
  email: Scalars['String']['input'];
};


export type UserQueryUsersArgs = {
  pagination?: InputMaybe<PaginationInput>;
};

/** User role enum for GraphQL */
export enum UserRole {
  Admin = 'ADMIN',
  Customer = 'CUSTOMER',
  Manager = 'MANAGER'
}
