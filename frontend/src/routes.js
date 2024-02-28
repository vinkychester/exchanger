import React from "react";

const Home = React.lazy(() => import('./pages/home/home.component'));
const AboutUs = React.lazy(() => import('./pages/about-us/about-us.component'));
const Contacts = React.lazy(() => import('./pages/contacts/contacts.component'));
const LoginPage = React.lazy(() => import('./pages/login/login.component'));
const RegistrationPage = React.lazy(() => import('./pages/registration/registration.component'));
const Account = React.lazy(() => import('./pages/account/account.component'));
const PaymentSettingsPage = React.lazy(() => import('./pages/payment-settings/payment-settings.component'));
const RequisitionDetailsPage = React.lazy(() => import('./pages/requisition-details/requisition-details.component'));
const CurrencyPage = React.lazy(() => import('./pages/currency/currency.component'));
const AdminPage = React.lazy(() => import('./pages/admin/admin.component'));
const ManagerPage = React.lazy(() => import('./pages/manager/manager.component'));
const SeoPage = React.lazy(() => import('./pages/seo/seo.component'));
const EmailConfirmPage = React.lazy(() => import('./pages/email-confirm/email-confirm.component'));
const ForgotPasswordPage = React.lazy(() => import('./pages/forgot-password/forgot-password.component'));
const ChangePasswordPage = React.lazy(() => import('./pages/change-password/change-password.component'));
const RequisitionPage = React.lazy(() => import('./pages/requisition/requisition.component'));
// const DocumentPage = React.lazy(() => import('./pages/document/document.component'));
const News = React.lazy(() => import('./pages/news/news.component'));
const NewsCreatePost = React.lazy(() => import('./components/news/news-create-post.component'));
const NewsEditForm = React.lazy(() => import('./components/news/news-edit-form.component'));
const NewsDetailsPage = React.lazy(() => import('./pages/news/news-details.component'));
const Reviews = React.lazy(() => import('./pages/review/reviews.component'));
const ReviewsAdmin = React.lazy(() => import('./pages/review/review-admin.component'));
const ReviewEditPanel = React.lazy(() => import('./components/review/review-admin-edit.component'));
const NewsAdmin = React.lazy(() => import('./pages/news/news-admin.component'));
const LoyaltyProgramPage = React.lazy(() => import('./pages/loyalty-program/loyalty-program.component'));
const BankDetailsPage = React.lazy(() => import('./pages/bank-details/bank-details.component'));
const NavInformationPage = React.lazy(() => import('./components/navigation/nav-information-page.component'));
const ReportsPage = React.lazy(() => import('./pages/reports/reports.component'));
const ManagersDetailsPage = React.lazy(() => import('./pages/manager/manager-details.component'));
const UseTerms = React.lazy(() => import('./pages/static-information/use-terms.component'));
const PrivacyPolicy = React.lazy(() => import('./pages/static-information/privacy-policy.component'));
const LoyaltyProgramInfo = React.lazy(() => import('./pages/loyalty-program/loyalty-program-info.component'));
const CryptoDictionary = React.lazy(() => import('./pages/crypto-dictionary/crypto-dictionary.component'));
const ExchangeRegulations = React.lazy(() => import('./pages/static-information/exchange-regulations.component'));
const CardVerificationManual = React.lazy(() => import('./pages/static-information/card-verification-manual.component'));
const FastCryptocurrencyExchange = React.lazy(() => import('./pages/seo-content/fast-cryptocurrency-exchange'));
// const FastCryptocurrencyExchange = React.lazy(() => import('./pages/seo-content/fast-cryptocurrency-exchange'));
const CryptocurrencyExchange = React.lazy(() => import('./pages/seo-content/cryptocurrency-exchange'));
const BitcoinWallet = React.lazy(() => import('./pages/seo-content/bitcoin-wallet'));
const BitcoinRate = React.lazy(() => import('./pages/seo-content/bitcoin-rate'));
const ReferralReportDetails = React.lazy(() => import('./components/reports/referral-reports/referral-report-details.component'));
const FeedbackPage = React.lazy(() => import('./pages/feedback/feedbacks-page.component'));
const FeedbackDetailsPage = React.lazy(() => import('./pages/feedback/feedback-details-page.component'));
const CityContactsPage = React.lazy(() => import('./pages/city-contacs/city-contacts.component'));
const CityDetailsPage = React.lazy(() => import('./pages/city-descriptions/city-descriptions.component'));
const CityDetailsEditPage = React.lazy(() => import('./pages/city-descriptions/city-description-edit.component'));
const CitiesPage = React.lazy(() => import('./pages/cities/cities.component'));
const TrafficComponent = React.lazy(() => import('./pages/traffic/traffic.component'));
const NotFoundComponent = React.lazy(() => import('./pages/not-found/not-found.component'));
const CityDescriptionPage = React.lazy(() => import('./pages/city-description/city-description.page.component'));
const FaqInformation = React.lazy(() => import('./pages/static-information/faq.component'));
const TrafficDetails = React.lazy(() => import('./components/reports/traffic-reports/traffic-details.component'));
const DocumentVerificationPage = React.lazy(() => import('./pages/document/document-verification.component'));
const CardVerificationPage = React.lazy(() => import('./pages/card-verification/card-verification.component'));
const CardVerificationDetailsPage = React.lazy(() => import('./pages/card-verification-details/card-verification-details.component'));
const ReferralClientsReportsContainer = React.lazy(() => import('./components/reports/referral-reports/client-referral-report.container'));
const MailingPage = React.lazy(() => import('./pages/mailing/mailing.component'));
const MailingDetailsPage = React.lazy(() => import('./pages/mailing/mailing-detail.component'));
const AdminDetailsPage = React.lazy(() => import('./pages/admin/admin-details.component'));
const Tariff = React.lazy(() => import('./pages/tariff/tariff.component'));
const ClientPage = React.lazy(() => import('./pages/client/client.component'));
const ClientDetailsPage = React.lazy(() => import('./pages/client-details/client-details.component'));
const LogsPage = React.lazy(() => import('./pages/logs/logs.component'));
const ManagersReportsDetailsContainer = React.lazy(() => import('./components/reports/manager-reports/managers-reports-details.container'));
const RatesPage = React.lazy(() => import('./pages/rates/rates.component'));
const TrafficReportsClientDetailsContainer = React.lazy(() => import('./components/reports/traffic-reports/traffic-reports-client-details-container.component'));
const TrafficReportsRequisitionDetailsContainer = React.lazy(() => import('./components/reports/traffic-reports/traffic-reports-requisition-details.container'));
const ExchangeDirectionsPage = React.lazy(() => import('./pages/exchange-directions/exchange-directions.component'));
const P24ToCrypto = React.lazy(() => import('./pages/exchange-directions/directions/p24-to-crypto'));
const MonobToCrypto = React.lazy(() => import('./pages/exchange-directions/directions/monob-to-crypto'));
const CardToCrypto = React.lazy(() => import('./pages/exchange-directions/directions/card-to-crypto'));
const CashToCrypto = React.lazy(() => import('./pages/exchange-directions/directions/cash-to-crypto'));

// import ClientManualPage from "./pages/manual/client-manual.component";
// import KycAndAml from "./pages/static-information/kyc-and-aml.component";
// import DocumentVerificationManual from "./pages/static-information/document-verification-manual.component";

const routes = [
  {
    title: "RatesPage",
    path: "/rates",
    component: RatesPage,
  },
  {
    title: "Tariff",
    path: "/tariff",
    component: Tariff,
  },
  {
    title: "AboutUs",
    path: "/about-us",
    component: AboutUs,
  },
  {
    title: "LoyaltyProgramInfo",
    path: "/partners",
    component: LoyaltyProgramInfo,
  },
  {
    title: "Information",
    path: "/info",
    component: NavInformationPage,
  },
  {
    title: "News",
    path: "/news",
    exact: true,
    component: News,
  },
  {
    title: "NewsDetails",
    path: "/news/:metaUrl",
    component: NewsDetailsPage,
  },
  {
    title: "Reviews",
    path: "/reviews",
    component: Reviews,
  },
  {
    title: "Contacts",
    path: "/contacts",
    component: Contacts,
  },
  {
    title: "Login",
    path: "/login",
    component: LoginPage,
  },
  {
    title: "RegistrationPage",
    path: "/registration",
    component: RegistrationPage,
  },
  {
    title: "EmailConfirmPage",
    path: "/email-confirm",
    component: EmailConfirmPage,
  },
  {
    title: "ForgotPasswordPage",
    path: "/forgot-password",
    component: ForgotPasswordPage,
  },
  {
    title: "ChangePasswordPage",
    path: "/change-password/:token?",
    component: ChangePasswordPage,
  },
  /*{
    title: "ClientManualPage",
    path: "/client-manual",
    component: ClientManualPage,
  },*/
  {
    title: "UseTerms",
    path: "/useterms",
    component: UseTerms,
  },
  {
    title: "PrivacyPolicy",
    path: "/privacy/ru",
    component: PrivacyPolicy,
  },
  {
    title: "CryptoDictionary",
    path: "/crypto-dictionary",
    component: CryptoDictionary,
  },
  {
    title: "ExchangeRegulations",
    path: "/exchange-regulations",
    component: ExchangeRegulations,
  },
  /*{
    title: "KycAndAml",
    path: "/kyc-and-aml-policy",
    component: KycAndAml,
  },*/
  {
    title: "FaqInformation",
    path: "/faq",
    component: FaqInformation,
  },
  /*{
    title: "DocumentVerificationManual",
    path: "/document-verification-manual",
    component: DocumentVerificationManual,
  },*/
  {
    title: "CardVerificationManual",
    path: "/card-verification-manual",
    component: CardVerificationManual,
  },
  // static seo page
  {
    title: "BitcoinRate",
    path: "/kurs-bitcoina",
    component: BitcoinRate,
  },
  {
    title: "FastCryptocurrencyExchange",
    path: "/obmenyat-kupit-kriptovalyutu",
    component: FastCryptocurrencyExchange,
  },
  {
    title: "CryptocurrencyExchange",
    path: "/obmen-kriptovalut",
    component: CryptocurrencyExchange,
  },
  {
    title: "BitcoinWallet",
    path: "/bitcoin-koshelek",
    component: BitcoinWallet,
  },

  // panel routes
  {
    title: "CardVerificationDetailsPage",
    path: "/panel/card-verification/details/:id",
    component: CardVerificationDetailsPage,
  },
  {
    title: "CardVerificationPage",
    path: "/panel/card-verification",
    component: CardVerificationPage,
  },
  {
    title: "PaymentSettingsPage",
    path: "/panel/payment-settings",
    component: PaymentSettingsPage,
  },
  {
    title: "Account",
    path: "/panel/account",
    component: Account,
  },
  {
    title: "Loyalty program",
    path: "/panel/loyalty-program",
    component: LoyaltyProgramPage,
  },
  // {
  //   title: "DocumentPage",
  //   path: "/panel/documents",
  //   component: DocumentPage,
  // },
  {
    title: "DocumentVerificationPage",
    path: "/panel/document/verification",
    component: DocumentVerificationPage,
  },
  {
    title: "RequisitionPage",
    path: "/panel/requisitions",
    component: RequisitionPage,
  },
  {
    title: "RequisitionDetailsPage",
    path: "/panel/requisition-details/:id",
    component: RequisitionDetailsPage,
  },
  {
    title: "ClientDetailsPage",
    path: "/panel/clients/:id",
    component: ClientDetailsPage,
  },
  {
    title: "ClientPage",
    path: "/panel/clients",
    component: ClientPage,
  },
  {
    title: "CurrencyPage",
    path: "/panel/currencies",
    component: CurrencyPage,
  },
  {
    title: "AdminPage",
    path: "/panel/admins",
    component: AdminPage,
  },
  {
    title: "ManagerDetailsPage",
    path: "/panel/manager/:id",
    component: ManagersDetailsPage,
  },
  {
    title: "AdminDetailsPage",
    path: "/panel/admin/:id",
    component: AdminDetailsPage,
  },
  {
    title: "ManagerPage",
    path: "/panel/managers",
    component: ManagerPage,
  },
  {
    title: "SeoPage",
    path: "/panel/seos",
    component: SeoPage,
  },
  {
    title: "NewsEditForm",
    path: "/panel/news/edit/:id",
    component: NewsEditForm,
  },
  {
    title: "ReferralReportDetails",
    path: "/panel/reports/details/:id",
    component: ReferralReportDetails,
  },
  {
    title: "LoyaltyReferrals",
    path: "/panel/reports/referrals/:id?/:referralLevel?",
    component: ReferralClientsReportsContainer
  },
  {
    title: "TrafficDetails",
    path: "/panel/reports/traffic-details/:id",
    component: TrafficDetails,
  },
  {
    title: "TrafficReportsClientDetailsContainer",
    path: "/panel/reports/traffic-details-clients/:id",
    component: TrafficReportsClientDetailsContainer,
  },
  {
    title: "TrafficReportsRequisitionDetailsContainer",
    path: "/panel/reports/traffic-details-requisitions/:id",
    component: TrafficReportsRequisitionDetailsContainer,
  },
  {
    title: "NewsCreatePost",
    path: "/panel/news/create",
    component: NewsCreatePost,
  },
  {
    title: "NewsAdmin",
    path: "/panel/news",
    exact: true,
    component: NewsAdmin,
  },
  {
    title: "ReviewsAdmin",
    path: "/panel/reviews",
    component: ReviewsAdmin,
  },
  {
    title: "LogsPage",
    path: "/panel/logs",
    component: LogsPage,
  },
  {
    title: "ReviewEdit",
    path: "/panel/review/edit/:id",
    component: ReviewEditPanel,
  },
  {
    title: "BankDetailsPage",
    path: "/panel/bank-details",
    component: BankDetailsPage,
  },
  {
    title: "Reports",
    path: "/panel/reports",
    component: ReportsPage
  },
  {
    title: "FeedbacksPage",
    path: "/panel/feedbacks",
    component: FeedbackPage,
  },
  {
    title: "FeedbackDetailsPage",
    path: "/panel/feedback/details/:id",
    component: FeedbackDetailsPage,
  },
  {
    title: "ContactsPage",
    path: "/panel/city-contacts",
    component: CityContactsPage,
  },
  {
    title: "MailingPage",
    path: "/panel/mailing",
    component: MailingPage,
  },
  {
    title: "MailingDetailsPage",
    path: "/panel/mailings/details/:id",
    component: MailingDetailsPage,
  },
  {
    title: "CityDetailsEdit",
    path: "/panel/city-details/edit/:id",
    component: CityDetailsEditPage,
  },
  {
    title: "CityDetails",
    path: "/panel/city-details",
    component: CityDetailsPage,
  },
  {
    title: "Cities",
    path: "/cities",
    component: CitiesPage,
  },
  {
    title: "CityExchange",
    path: "/city/:cityUrl",
    component: CityDescriptionPage,
  },
  {
    title: "ManagerReportsDetailsPage",
    path: "/panel/reports-manager-details/:id",
    component: ManagersReportsDetailsContainer,
  },
  {
    title: "Трафик",
    path: "/traffic/:traffic",
    exact: true,
    component: TrafficComponent,
  },
  {
    title: "Направления обмена",
    path: "/all-exchange-pairs",
    component: ExchangeDirectionsPage,
  },
  {
    title: "P24 to crypto",
    path: "/obmen-btc-privatbank-uah",
    component: P24ToCrypto,
  },
  {
    title: "Monob to crypto",
    path: "/obmen-btc-monobank-uah",
    component: MonobToCrypto,
  },
  {
    title: "Monob to crypto",
    path: "/obmen-btc-visa-mastercard-uah",
    component: CardToCrypto,
  },
  {
    title: "Monob to crypto",
    path: "/obmen-btc-cash",
    component: CashToCrypto,
  },
  // Main page
  // ([a-z-%\[\w\]]*-to-[a-z-%\[\w\]]*)?
  // ([a-z-]*-to-[a-z-]*)?
  // ([a-z-0-9%\[.*?\]]*-to-[a-z-0-9%\[.*?\]]*)?
  {
    title: "Home",
    path: "/:id(.refToken=[a-z-_0-9]*&cur_from=[A-Za-z0-9]*&cur_to=[A-Za-z0-9]*|[a-z-0-9@&]*-to-[a-z-0-9@&]*)?", //hrivna-uah-visa-to-hcrypto-bsv-bsv  ([a-z-%\(\w+\)]*-to-[a-z-%\(\w+\)]*)? //[a-z-0-9@&]*-to-[a-z-0-9@&]*
    exact: true,
    component: Home,
  },
  {
    title: "404",
    path: "/404",
    exact: true,
    component: NotFoundComponent,
  },
];

export default routes;
