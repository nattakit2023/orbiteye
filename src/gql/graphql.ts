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
  DateTime: { input: any; output: any; }
};

export type ActivityLog = {
  __typename?: 'ActivityLog';
  action: Scalars['String']['output'];
  activityType: ActivityType;
  createdAt: Scalars['DateTime']['output'];
  entityId?: Maybe<Scalars['String']['output']>;
  entityType: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  ipAddress?: Maybe<Scalars['String']['output']>;
  metadata?: Maybe<Scalars['String']['output']>;
  severity: Severity;
  userAgent?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['Int']['output']>;
};

export type ActivityLogFilterInput = {
  activityType?: InputMaybe<ActivityType>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  entityType?: InputMaybe<Scalars['String']['input']>;
  severity?: InputMaybe<Severity>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  userId?: InputMaybe<Scalars['Int']['input']>;
};

export type ActivitySummary = {
  __typename?: 'ActivitySummary';
  logsBySeverity: Array<SeverityCount>;
  logsByType: Array<TypeCount>;
  recentLogs: Array<ActivityLog>;
  totalLogs: Scalars['Int']['output'];
};

export enum ActivityType {
  AuthenticationFailed = 'AuthenticationFailed',
  CartConverted = 'CartConverted',
  CartCreated = 'CartCreated',
  CartUpdated = 'CartUpdated',
  OrderCancelled = 'OrderCancelled',
  OrderCreated = 'OrderCreated',
  OrderUpdated = 'OrderUpdated',
  PasswordChanged = 'PasswordChanged',
  ProfileUpdated = 'ProfileUpdated',
  SystemError = 'SystemError',
  UserCreated = 'UserCreated',
  UserDeleted = 'UserDeleted',
  UserLogin = 'UserLogin',
  UserLogout = 'UserLogout',
  UserUpdated = 'UserUpdated'
}

export type AddCartItemInput = {
  cartId: Scalars['Int']['input'];
  productId: Scalars['Int']['input'];
  quantity: Scalars['Int']['input'];
  unitPrice: Scalars['Float']['input'];
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  expiresIn: Scalars['Int']['output'];
  refreshToken?: Maybe<Scalars['String']['output']>;
  token: Scalars['String']['output'];
  tokenType: Scalars['String']['output'];
  user: User;
};

export type Cart = {
  __typename?: 'Cart';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  items: Array<CartItem>;
  status: CartStatus;
  totalAmount: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['Int']['output'];
};

export type CartItem = {
  __typename?: 'CartItem';
  id: Scalars['Int']['output'];
  productId: Scalars['Int']['output'];
  productName: Scalars['String']['output'];
  quantity: Scalars['Int']['output'];
  subtotal: Scalars['Float']['output'];
  unitPrice: Scalars['Float']['output'];
};

export enum CartStatus {
  Abandoned = 'Abandoned',
  Active = 'Active',
  Converted = 'Converted'
}

export type ConvertCartToOrderInput = {
  cartId: Scalars['Int']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  shippingAddress: ShippingAddressInput;
};

export type CreateActivityLogInput = {
  action: Scalars['String']['input'];
  activityType: ActivityType;
  entityId?: InputMaybe<Scalars['String']['input']>;
  entityType: Scalars['String']['input'];
  ipAddress?: InputMaybe<Scalars['String']['input']>;
  metadata?: InputMaybe<Scalars['String']['input']>;
  severity: Severity;
  userAgent?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['Int']['input']>;
};

export type CreateCartInput = {
  userId: Scalars['Int']['input'];
};

export type CreateOrderInput = {
  items: Array<CreateOrderItemInput>;
  notes?: InputMaybe<Scalars['String']['input']>;
  shippingAddress: ShippingAddressInput;
  userId: Scalars['Int']['input'];
};

export type CreateOrderItemInput = {
  productId: Scalars['Int']['input'];
  quantity: Scalars['Int']['input'];
  unitPrice: Scalars['Float']['input'];
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  fullName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  role?: InputMaybe<Scalars['String']['input']>;
};

export type GoogleLoginInput = {
  email: Scalars['String']['input'];
  first_name: Scalars['String']['input'];
  google_id: Scalars['String']['input'];
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addCartItem: Cart;
  cancelOrder: Order;
  changePassword: Scalars['Boolean']['output'];
  convertCartToOrder: Order;
  createActivityLog: ActivityLog;
  createCart: Cart;
  createOrder: Order;
  createUser: User;
  deleteUser: Scalars['Boolean']['output'];
  googleLogin: AuthResponse;
  login: AuthResponse;
  logout: Scalars['Boolean']['output'];
  refreshToken: AuthResponse;
  register: AuthResponse;
  removeCartItem: Cart;
  resetPassword: Scalars['Boolean']['output'];
  updateCartItem: Cart;
  updateOrder: Order;
  updateUser: User;
};


export type MutationAddCartItemArgs = {
  input: AddCartItemInput;
};


export type MutationCancelOrderArgs = {
  id: Scalars['String']['input'];
};


export type MutationChangePasswordArgs = {
  currentPassword: Scalars['String']['input'];
  id: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};


export type MutationConvertCartToOrderArgs = {
  input: ConvertCartToOrderInput;
};


export type MutationCreateActivityLogArgs = {
  input: CreateActivityLogInput;
};


export type MutationCreateCartArgs = {
  input: CreateCartInput;
};


export type MutationCreateOrderArgs = {
  input: CreateOrderInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationDeleteUserArgs = {
  id: Scalars['String']['input'];
};


export type MutationGoogleLoginArgs = {
  input: GoogleLoginInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRefreshTokenArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationRegisterArgs = {
  input: CreateUserInput;
};


export type MutationRemoveCartItemArgs = {
  input: RemoveCartItemInput;
};


export type MutationResetPasswordArgs = {
  email: Scalars['String']['input'];
};


export type MutationUpdateCartItemArgs = {
  input: UpdateCartItemInput;
};


export type MutationUpdateOrderArgs = {
  id: Scalars['String']['input'];
  input: UpdateOrderInput;
};


export type MutationUpdateUserArgs = {
  id: Scalars['String']['input'];
  input: UpdateUserInput;
};

export type Order = {
  __typename?: 'Order';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  items: Array<OrderItem>;
  notes?: Maybe<Scalars['String']['output']>;
  shippingAddress?: Maybe<ShippingAddress>;
  status: OrderStatus;
  totalAmount: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['Int']['output'];
};

export type OrderItem = {
  __typename?: 'OrderItem';
  id: Scalars['Int']['output'];
  productId: Scalars['Int']['output'];
  productName: Scalars['String']['output'];
  quantity: Scalars['Int']['output'];
  subtotal: Scalars['Float']['output'];
  unitPrice: Scalars['Float']['output'];
};

export type OrderPaginationInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type OrderStatistics = {
  __typename?: 'OrderStatistics';
  cancelledOrders: Scalars['Int']['output'];
  deliveredOrders: Scalars['Int']['output'];
  pendingOrders: Scalars['Int']['output'];
  processingOrders: Scalars['Int']['output'];
  shippedOrders: Scalars['Int']['output'];
  totalOrders: Scalars['Int']['output'];
  totalRevenue: Scalars['Float']['output'];
};

export enum OrderStatus {
  Cancelled = 'Cancelled',
  Delivered = 'Delivered',
  Pending = 'Pending',
  Processing = 'Processing',
  Shipped = 'Shipped'
}

export type PaginationInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type Query = {
  __typename?: 'Query';
  activityLog?: Maybe<ActivityLog>;
  activityLogs: Array<ActivityLog>;
  activitySummary: ActivitySummary;
  cart?: Maybe<Cart>;
  cartByUserId?: Maybe<Cart>;
  carts: Array<Cart>;
  health: Scalars['String']['output'];
  isEmailAvailable: Scalars['Boolean']['output'];
  me?: Maybe<User>;
  order?: Maybe<Order>;
  orderStatistics: OrderStatistics;
  orders: Array<Order>;
  ordersByStatus: Array<Order>;
  ordersByUserId: Array<Order>;
  recentOrders: Array<Order>;
  time: Scalars['String']['output'];
  user?: Maybe<User>;
  userActivityStats: UserActivityStats;
  userByEmail?: Maybe<User>;
  users: Array<User>;
};


export type QueryActivityLogArgs = {
  id: Scalars['String']['input'];
};


export type QueryActivityLogsArgs = {
  filter?: InputMaybe<ActivityLogFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryCartArgs = {
  id: Scalars['String']['input'];
};


export type QueryCartByUserIdArgs = {
  userId: Scalars['String']['input'];
};


export type QueryCartsArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryIsEmailAvailableArgs = {
  email: Scalars['String']['input'];
};


export type QueryOrderArgs = {
  id: Scalars['String']['input'];
};


export type QueryOrderStatisticsArgs = {
  status?: InputMaybe<OrderStatus>;
};


export type QueryOrdersArgs = {
  pagination?: InputMaybe<OrderPaginationInput>;
};


export type QueryOrdersByStatusArgs = {
  pagination?: InputMaybe<OrderPaginationInput>;
  status: OrderStatus;
};


export type QueryOrdersByUserIdArgs = {
  pagination?: InputMaybe<OrderPaginationInput>;
  userId: Scalars['String']['input'];
};


export type QueryRecentOrdersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryUserArgs = {
  id: Scalars['String']['input'];
};


export type QueryUserActivityStatsArgs = {
  userId: Scalars['String']['input'];
};


export type QueryUserByEmailArgs = {
  email: Scalars['String']['input'];
};


export type QueryUsersArgs = {
  pagination?: InputMaybe<PaginationInput>;
};

export type RemoveCartItemInput = {
  cartId: Scalars['Int']['input'];
  itemId: Scalars['Int']['input'];
};

export enum Severity {
  Critical = 'Critical',
  Error = 'Error',
  Info = 'Info',
  Warning = 'Warning'
}

export type SeverityCount = {
  __typename?: 'SeverityCount';
  count: Scalars['Int']['output'];
  severity: Severity;
};

export type ShippingAddress = {
  __typename?: 'ShippingAddress';
  city: Scalars['String']['output'];
  country: Scalars['String']['output'];
  postalCode: Scalars['String']['output'];
  state: Scalars['String']['output'];
  street: Scalars['String']['output'];
};

export type ShippingAddressInput = {
  city: Scalars['String']['input'];
  country: Scalars['String']['input'];
  postalCode: Scalars['String']['input'];
  state: Scalars['String']['input'];
  street: Scalars['String']['input'];
};

export type TypeCount = {
  __typename?: 'TypeCount';
  activityType: ActivityType;
  count: Scalars['Int']['output'];
};

export type UpdateCartItemInput = {
  cartId: Scalars['Int']['input'];
  itemId: Scalars['Int']['input'];
  quantity: Scalars['Int']['input'];
};

export type UpdateOrderInput = {
  notes?: InputMaybe<Scalars['String']['input']>;
  shippingAddress?: InputMaybe<ShippingAddressInput>;
  status?: InputMaybe<OrderStatus>;
};

export type UpdateUserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  fullName?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime']['output'];
  displayName: Scalars['String']['output'];
  email: Scalars['String']['output'];
  fullName: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  isAdmin: Scalars['Boolean']['output'];
  isManager: Scalars['Boolean']['output'];
  role: UserRole;
  updatedAt: Scalars['DateTime']['output'];
};

export type UserActivityStats = {
  __typename?: 'UserActivityStats';
  actionsBySeverity: Array<SeverityCount>;
  actionsByType: Array<TypeCount>;
  recentActivity: Array<ActivityLog>;
  totalActions: Scalars['Int']['output'];
  userId: Scalars['Int']['output'];
};

export type UserFilterInput = {
  createdAfter?: InputMaybe<Scalars['DateTime']['input']>;
  createdBefore?: InputMaybe<Scalars['DateTime']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
};

export enum UserRole {
  Admin = 'Admin',
  Customer = 'Customer',
  Manager = 'Manager'
}

export enum UserStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Suspended = 'Suspended'
}
