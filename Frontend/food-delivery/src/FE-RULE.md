> Tài liệu tiêu chuẩn Frontend — React + Vite + Tailwind
>
> Mục đích: Đây là tài liệu hướng dẫn toàn bộ team triển khai, coding convention, folder structure, layout, flow auth/role, và các ghi chú chính xác về context cho các thành viên và AI Agent code một cách nhất quán .
> Phiên bản: 1.0
> Ngày sửa đổi: 2025-10-22

---

# 1. Tổng quan kiến trúc

* **Tech stack:** React (Vite) + Tailwind CSS + React Router v6 + Axios + Context API.
* **Roles:** `customer`, `owner`, `admin`. Layout và route phân theo role sau khi auth.

---

# 2. Mục tiêu tài liệu

* Chuẩn hóa cấu trúc thư mục để dễ maintain & scale.
* Xác định rõ layout cho từng role và mapping mỗi màn hình vào component chính.
* Định nghĩa conventions để tất cả dev code consistent.
* Cung cấp snippets & checklist để dễ onboard + tích hợp AI Agent.

---

# 3. Cấu trúc thư mục

```
src/
├─ assets/
├─ components/
│  ├─ ui/
│  ├─ layout/
│  └─ widgets/
├─ features/
│  ├─ auth/
│  ├─ home/
│  ├─ browse/
│  ├─ food/
│  ├─ cart/
│  ├─ order/
│  ├─ owner/
│  ├─ admin/
│  └─ stats/
├─ layouts/
├─ contexts/
├─ hooks/
├─ services/
├─ routes/
├─ utils/
├─ types/
├─ main.tsx
└─ index.css
```

**Ghi chú:** mỗi feature chứa `components`, `hooks`, `api.ts`, `types.ts`, `screens` (nếu cần).

---

# 4. Layouts chính

* **AppLayout (Customer)**
  * Header + (optional) left filter sidebar + content.
* **OwnerDashboardLayout**
  * Collapsible sidebar quản lý, topbar.
* **AdminDashboardLayout**
  * sidebar trái, chi tiết và bảng, chart.
* **AuthLayout**
  * Auth form
---

# 5. Mapping màn hình => Layout + Components chính

(Mỗi mục gồm screen -> layout -> components chính)

* HomeScreen — AppLayout — SearchBar, HeroSlider, CuisineCategories, RecommendList, RestaurantCard, RestaurantList, PromoBanner
* SignupScreen — AuthLayout — SignupForm
* LoginScreen — AuthLayout — LoginForm, ResetPasswordModal
* Change password — AuthLayout modal — ChangePasswordForm
* ProfileScreen — AppLayout — ProfileView, ProfileEditForm, OrderSummary
* OwnerRegisterScreen — AuthLayout — OwnerRegisterForm, UploadDocs
* RestaurantDetailsScreen — AppLayout — FoodList, MapView (optional)
* FoodDetailScreen — AppLayout — FoodGallery, FoodInfo, AddToCartBar, ReviewsList, ReviewForm
* CartScreen — AppLayout — CartList, CheckoutSummary, AddressSelector
* PaymentScreen — AppLayout — PaymentMethods, OrderSummary, PlaceOrderButton
* OrderDetailScreen — AppLayout — OrderTimeline, TrackingMap, CancelButton
* Review/Comment — within FoodDetailScreen — ReviewList, ReviewForm
* OrderListScreen — AppLayout — OrderItem, FilterByStatus

* OwnerDashboardScreen — OwnerDashboardLayout — RevenueWidget, OrdersTodayWidget, TopSellingItems
* OwnerRestaurantInfoScreen — OwnerDashboardLayout — RestaurantForm, OpeningHoursEditor, ToggleAcceptOrders, ShippingFeeForm
* OwnerMenuListScreen — OwnerDashboardLayout — FoodCardList, AddFoodButton
* AddFoodScreen — OwnerDashboardLayout — FoodForm, ImageUploader, ComboSelector
* FoodManagerScreen — OwnerDashboardLayout — FoodEditForm, StatusToggle, DeleteConfirmModal
* PromotionComboScreen — OwnerDashboardLayout — PromotionList, PromotionForm
* OwnerOrderListScreen — OwnerDashboardLayout — OrderTable, StatusUpdateControls, AcceptRejectButtons

* AdminUserListScreen — AdminDashboardLayout — UserTable, LockUnlockControl
* UserStatisticsScreen — AdminDashboardLayout — UserStatsFilters, UserStatsTable
* OwnerRequestApprovalScreen — AdminDashboardLayout — OwnerRequestList, ApproveRejectButtons
* AdminRestaurantLockScreen — AdminDashboardLayout — RestaurantList, LockUnlock
* AdminRoleManagementScreen — AdminDashboardLayout — RoleForm, RoleAssignmentTable
* RestaurantApprovalScreen — AdminDashboardLayout — PendingRestaurantsList
* RestaurantCategoryScreen — AdminDashboardLayout — CategoryList, CategoryForm
* SystemOrderTrackingScreen — AdminDashboardLayout — RealtimeOrderMap, OrderFlow
* AdminReportHandlingScreen — AdminDashboardLayout — ReportList, ActionPanel
* OrderStatisticsScreen — AdminDashboardLayout — OrderChart, Filter
* RevenueStatisticsScreen — AdminDashboardLayout — RevenueChart, ExportButton
* FoodStatisticsScreen — AdminDashboardLayout — TopFoodsChart, ExportCSV
---

# 6. Coding conventions

* **File naming:** PascalCase cho component & screen (`HomeScreen.tsx`, `FoodCard.tsx`).
* **Hooks:** `useXxx.ts` (VD: `useAuth.ts`).
* **APIs:** mỗi feature `api.ts` export các function chính (`getFoods`, `createOrder`).
* **Types:** feature-level `types.ts`, global types trong `src/types/`.
* **Props:** tất cả component chấp nhận `className?: string` và `...rest` để compose className. 
* **Tailwind:** mobile-first; avoid long inline styles — nếu component quá dài thì tách thành biến.
* **Accessibility:** semantic tags, aria labels cho interactive elements, focus management cho modal.

---

# 7. Auth & Role flow

* **AuthContext** exposes `{ user, role, token, isAuthenticated, login(), logout(), refreshToken() }`.
* **Token storage:** Xử lý ở backend.
* **ProtectedRoute:** check isAuthenticated sau đó là roles. nếu chưa đăng nhập => `/login`; sai role => `/unauthorized`.
* **OwnerContext:** store `currentRestaurant` & owner settings.

Snippet `ProtectedRoute` tại `src/routes/ProtectedRoute.tsx`.

---

# 8. API layer

* `src/services/apiClient.ts`: axios instance với interceptors (attach token, handle 401 refresh logic).
* **Contract rule:** mỗi endpoint được wrap trong feature `api.ts` thay vì gọi axios trực tiếp trong component.
* **Error handling:** api functions throw errors; UI dùng `try/catch` và `ToastContext` để show message.

---

# 9. State management

* **Local UI state:** component local state (useState) cho form, modal.
* **Shared state:** Contexts cho auth, cart, notifications.
* **Data fetching:** useEffect + axios; có thể bổ sung `react-query` (nếu cần caching/pagination more robust).

---

# 10. Shared components

* **Atomic:** Button, Input, IconButton, Select, Modal, Spinner, Avatar.
* **Molecule:** SearchBar, CartPreview, RatingStars.
* **Organism:** FoodCard, RestaurantCard, OrderCard, FilterPanel.

**Rule:** Put reusable components in `src/components/*` and import from there; feature-level UI specific components go inside `features/<feature>/components`.

---

# 11. Routing (naming + nested)

* Root routes in `src/routes/AppRoutes.tsx`.
* Use nested routes to wrap role layouts:

  * `/` (AppLayout)
  * `/owner/*` (OwnerDashboardLayout)
  * `/admin/*` (AdminDashboardLayout)

---

# 12. Accessibility & Performance

* Use `loading="lazy"` for images gallery.
* Minimize bundle: tree-shaking, dynamic imports for large owner/admin modules.
* Use aria attributes, keyboard navigation for critical flows.

---

# 13. Onboarding & AI Agent guidance

**Context for AI Agent:**

* Single repo, role-based UI. Key contexts to supply to Agent: `role` (customer/owner/admin), current route, current restaurant (if owner), cart items.
* When using AI to generate code/components, instruct it to:

  1. Place files under proper `features/` or `components/`.
  2. Export default component with PascalCase name.
  3. Avoid direct DOM querying; use React props & state.
  4. Use Tailwind classes; keep class composition in `className`.
  5. Reference `api` functions from `features/*/api.ts` instead of raw fetch inside component.

**AI prompt template (devs reuse):**

```
You are a frontend developer for our food-order app. Create <component> under src/<path> using React + TypeScript + Tailwind. Use existing api function <apiFn> from <feature>/api.ts. Component must accept props {className?: string, ...} and be accessible (aria). Keep file size <200 LOC. Export default."
```
---

# 14. Phiên bản & thay đổi

* Lưu ý cập nhật file này khi có thay đổi lớn trong tech choices (ví dụ: chuyển Redux/ReactQuery, đổi auth storage sang cookie, thêm SSO).
