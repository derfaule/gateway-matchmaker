export interface PaymentGateway {
  id: string;
  name: string;
  logo: string;
  description: string;
  features: string[];
  isRecommended?: boolean;
  isSystemSuggested?: boolean;
  score: number;
  supportedCurrencies: string[];
  supportedPaymentMethods: string[];
  technicalDetails: string[];
}

export const allCurrencies = [
  "USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CHF", "SEK", "NOK", "DKK", 
  "SGD", "HKD", "BRL", "MXN", "INR", "CNY", "KRW", "ZAR", "RUB", "PLN",
  "CZK", "HUF", "THB", "MYR", "PHP", "IDR", "VND", "TRY", "ILS", "AED"
];

export const allPaymentMethods = [
  "Credit Cards", "PayPal", "Apple Pay", "Google Pay", "Bank Transfer", 
  "SEPA Direct Debit", "iDEAL", "Klarna", "Afterpay", "WeChat Pay", "Alipay", 
  "Venmo", "Zelle", "ACH", "Wire Transfer", "BACS", "BECS", "Faster Payments", 
  "SOFORT", "Giropay", "Bancontact", "EPS", "Przelewy24", "Multibanco", "BLIK", 
  "Trustly", "Paysafecard", "Skrill", "Carte Bancaire"
];

export const gatewayDatabase: PaymentGateway[] = [
  {
    id: "adyen",
    name: "Adyen",
    logo: "💳",
    description: "Best for enterprise; Arguably the most global gateway.",
    features: ["Global coverage", "Unified commerce", "Advanced fraud protection", "Local payment methods"],
    score: 0,
    supportedCurrencies: ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CHF", "SEK", "NOK", "DKK", "SGD", "HKD", "BRL", "MXN", "INR", "CNY", "KRW", "ZAR", "RUB", "PLN", "CZK", "HUF", "THB", "MYR"],
    supportedPaymentMethods: ["Credit Cards", "PayPal", "Apple Pay", "Google Pay", "Bank Transfer", "ACH", "BACS", "SEPA Direct Debit", "iDEAL", "Klarna", "Afterpay", "WeChat Pay", "Alipay", "SOFORT", "Giropay", "Bancontact", "EPS", "Przelewy24", "Multibanco", "Carte Bancaire"],
    technicalDetails: [
      "RESTful API v68 with comprehensive documentation",
      "SDKs available for Java, .NET, Python, PHP, Node.js, iOS, Android",
      "Webhooks with automatic retry and signature verification",
      "PCI DSS Level 1 compliant with additional security certifications",
      "Average transaction latency: 150ms globally",
      "Advanced machine learning fraud detection with 99.2% accuracy",
      "Real-time reporting and analytics dashboard",
      "Tokenization and network tokenization support",
      "3D Secure 2.0 authentication",
      "Marketplace and platform payment support"
    ]
  },
  {
    id: "paypal",
    name: "PayPal",
    logo: "🅿️",
    description: "Digital payments platform for online money transfers",
    features: ["Buyer protection", "Global reach", "Easy integration", "Multiple currencies"],
    score: 0,
    supportedCurrencies: ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CHF", "SEK", "NOK", "DKK", "SGD", "HKD", "BRL", "MXN", "INR", "CNY", "KRW", "ZAR", "RUB", "PLN", "CZK", "HUF"],
    supportedPaymentMethods: ["PayPal", "Credit Cards", "Bank Transfer", "Apple Pay", "Google Pay", "Venmo", "PayPal Credit", "ACH", "SEPA Direct Debit", "SOFORT", "iDEAL", "Bancontact", "Giropay"],
    technicalDetails: [
      "REST API v2 with GraphQL endpoints",
      "SDKs for JavaScript, Python, Java, PHP, .NET, Ruby, iOS, Android",
      "Webhook notifications with IPN fallback",
      "PCI DSS Level 1 compliance",
      "Average transaction latency: 200ms",
      "Built-in fraud protection and seller protection",
      "PayPal Checkout experience optimization",
      "Subscription and recurring billing support",
      "Multi-party payments and marketplace solutions",
      "Advanced analytics and conversion insights"
    ]
  },
  {
    id: "cybersource",
    name: "CyberSource",
    logo: "🔒",
    description: "Gateway services available for Barclays (EU), Chase, Elavon, and TSYS and more.",
    features: ["Enterprise-grade security", "Global payment processing", "Risk management", "Token management"],
    score: 0,
    supportedCurrencies: ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CHF", "SEK", "NOK", "DKK", "SGD", "HKD", "BRL", "MXN", "INR", "CNY", "KRW", "ZAR", "RUB", "PLN", "CZK", "HUF", "THB"],
    supportedPaymentMethods: ["Credit Cards", "PayPal", "Apple Pay", "Google Pay", "Bank Transfer", "ACH", "Wire Transfer", "SEPA Direct Debit"],
    technicalDetails: [
      "REST API and SOAP web services",
      "SDKs for Java, .NET, PHP, Python, Ruby",
      "Real-time decision manager for fraud prevention",
      "PCI DSS Level 1 with additional enterprise certifications",
      "Average transaction latency: 180ms",
      "AI-powered fraud scoring with 300+ risk factors",
      "Advanced token management and data security",
      "Comprehensive reporting and business intelligence",
      "3D Secure authentication services",
      "Global payment processing with local acquiring"
    ]
  },
  {
    id: "stripe",
    name: "Stripe",
    logo: "⚡",
    description: "Great for SMB > Enterprise. Enter new markets easily with wide range of APMs. Increase checkout conversion with Link by Stripe.",
    features: ["Developer-friendly APIs", "Global payments", "Subscription billing", "Marketplace payments"],
    score: 0,
    supportedCurrencies: ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CHF", "SEK", "NOK", "DKK", "SGD", "HKD", "BRL", "MXN", "INR", "CNY", "KRW", "ZAR", "PLN", "CZK", "HUF", "THB", "MYR"],
    supportedPaymentMethods: ["Credit Cards", "Apple Pay", "Google Pay", "Bank Transfer", "ACH", "BACS", "BECS", "SEPA Direct Debit", "iDEAL", "Klarna", "Afterpay", "Alipay", "WeChat Pay", "SOFORT", "Giropay", "Bancontact", "BLIK", "Przelewy24", "Carte Bancaire"],
    technicalDetails: [
      "RESTful API with extensive documentation and examples",
      "Official libraries for Ruby, Python, PHP, Node.js, Java, .NET, Go",
      "Webhooks with automatic retries and signature verification",
      "PCI DSS Level 1 compliant",
      "Average transaction latency: 120ms",
      "Machine learning-based fraud detection (Radar)",
      "Elements for secure payment form building",
      "Advanced subscription and billing management",
      "Connect platform for marketplace payments",
      "Real-time financial reporting and reconciliation"
    ]
  },
  {
    id: "worldpay",
    name: "Worldpay",
    logo: "🌍",
    description: "Vantiv is a US-only gateway; we prefer new merchants integrate with Worldpay Gateway.",
    features: ["Omnichannel payments", "Risk management", "Alternative payments", "Enterprise solutions"],
    score: 0,
    supportedCurrencies: ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CHF", "SEK", "NOK", "DKK", "SGD", "HKD", "BRL", "MXN", "INR", "CNY", "KRW", "ZAR", "RUB", "PLN", "CZK", "HUF"],
    supportedPaymentMethods: ["Credit Cards", "PayPal", "Apple Pay", "Google Pay", "Bank Transfer", "SEPA Direct Debit", "iDEAL", "Klarna", "SOFORT", "Giropay", "Bancontact"],
    technicalDetails: [
      "REST API and XML gateway integration",
      "SDKs for major programming languages and platforms",
      "Advanced webhooks and notification systems",
      "PCI DSS Level 1 with enterprise security features",
      "Average transaction latency: 160ms",
      "FraudSight fraud prevention technology",
      "Omnichannel payment orchestration",
      "Global acquiring and local payment methods",
      "Advanced reporting and analytics suite",
      "White-label payment solutions"
    ]
  },
  {
    id: "authorize",
    name: "Authorize.Net",
    logo: "🔐",
    description: "Gateway services available for Barclays (EU), Chase, Elavon, and TSYS and more.",
    features: ["Fraud detection", "Recurring billing", "Customer profiles", "Virtual terminal"],
    score: 0,
    supportedCurrencies: ["USD", "CAD", "EUR", "GBP", "AUD"],
    supportedPaymentMethods: ["Credit Cards", "ACH", "eCheck", "PayPal", "Apple Pay", "Bank Transfer"],
    technicalDetails: [
      "REST API and legacy AIM/ARB/CIM APIs",
      "SDKs for PHP, .NET, Java, Ruby, Python",
      "Silent Post URL webhooks",
      "PCI DSS Level 1 compliant",
      "Average transaction latency: 250ms",
      "Basic fraud detection suite (FDS)",
      "Customer Information Manager (CIM)",
      "Automated Recurring Billing (ARB)",
      "Virtual terminal for manual transactions",
      "Accept.js for secure payment data collection"
    ]
  },
  {
    id: "square",
    name: "Square",
    logo: "⬜",
    description: "Payment and point-of-sale solutions",
    features: ["In-person payments", "Online payments", "Inventory management", "Analytics"],
    score: 0,
    supportedCurrencies: ["USD", "CAD", "EUR", "GBP", "AUD", "JPY"],
    supportedPaymentMethods: ["Credit Cards", "Apple Pay", "Google Pay", "Cash", "Gift Cards", "ACH", "Bank Transfer"],
    technicalDetails: [
      "REST API with comprehensive endpoint coverage",
      "SDKs for iOS, Android, JavaScript, PHP, Ruby, Python, Java, .NET",
      "Webhooks with signature verification",
      "PCI DSS Level 1 compliant",
      "Average transaction latency: 180ms",
      "Basic fraud protection included",
      "Point of Sale API for in-person payments",
      "Inventory and catalog management APIs",
      "Team and location management",
      "Real-time analytics and reporting dashboard"
    ]
  },
  {
    id: "braintree",
    name: "Braintree",
    logo: "🌳",
    description: "Great for SMBs or growing merchants looking for a flexible, scalable, and developer-friendly payment solution. It's the only option for Venmo, and an alternative for PayPal direct integration. Note: Exploring Fastlane checkout for Braintree and PayPal Complete (no ETA).",
    features: ["Mobile-first", "Global reach", "Marketplace payments", "Subscription billing"],
    score: 0,
    supportedCurrencies: ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CHF", "SEK", "NOK", "DKK", "SGD", "HKD", "BRL", "MXN", "THB", "MYR"],
    supportedPaymentMethods: ["Credit Cards", "PayPal", "Apple Pay", "Google Pay", "Venmo", "Bank Transfer", "SEPA Direct Debit", "iDEAL", "SOFORT", "Klarna"],
    technicalDetails: [
      "REST API with GraphQL support",
      "Client SDKs for iOS, Android, JavaScript and server SDKs for major languages",
      "Webhooks with automatic retry logic",
      "PCI DSS Level 1 compliant (PayPal owned)",
      "Average transaction latency: 140ms",
      "Advanced fraud protection tools",
      "Drop-in UI components for quick integration",
      "Subscription and recurring billing management",
      "Marketplace and split payment functionality",
      "Advanced vault for secure customer data storage"
    ]
  },
  {
    id: "vantiv",
    name: "Vantiv",
    logo: "🏪",
    description: "Vantiv is a US-only gateway; we prefer new merchants integrate with Worldpay Gateway.",
    features: ["US-only gateway", "Enterprise solutions", "Risk management", "Point-of-sale"],
    score: 0,
    supportedCurrencies: ["USD"],
    supportedPaymentMethods: ["Credit Cards", "ACH", "eCheck"],
    technicalDetails: [
      "REST API and legacy SOAP services",
      "SDKs for major programming languages",
      "PCI DSS Level 1 compliant",
      "Average transaction latency: 200ms",
      "Basic fraud detection included",
      "US-only processing capabilities"
    ]
  },
  {
    id: "stripe-elements",
    name: "Stripe Elements",
    logo: "⚡",
    description: "Stripe Elements (third-party checkout) + APMs.",
    features: ["Third-party checkout", "APMs", "Developer-friendly", "Conversion optimization"],
    score: 0,
    supportedCurrencies: ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CHF", "SEK", "NOK", "DKK", "SGD", "HKD", "BRL", "MXN", "INR", "CNY", "KRW", "ZAR", "PLN", "CZK", "HUF", "THB", "MYR"],
    supportedPaymentMethods: ["Credit Cards", "Apple Pay", "Google Pay", "Bank Transfer", "ACH", "BACS", "BECS", "SEPA Direct Debit", "iDEAL", "Klarna", "Afterpay", "Alipay", "WeChat Pay", "SOFORT", "Giropay", "Bancontact", "BLIK", "Przelewy24", "Carte Bancaire"],
    technicalDetails: [
      "Stripe Elements UI components",
      "Third-party checkout optimization",
      "Wide range of alternative payment methods",
      "PCI DSS Level 1 compliant",
      "Average transaction latency: 120ms",
      "Built-in conversion optimization"
    ]
  },
  {
    id: "ebanx",
    name: "Ebanx",
    logo: "🌎",
    description: "UPI in India. Coming in H2 2025: PIX recurring in Brazil & Mercado Pago in Mexico.",
    features: ["Emerging markets", "Local payment methods", "UPI", "PIX recurring"],
    score: 0,
    supportedCurrencies: ["USD", "BRL", "MXN", "INR", "ARS", "COP", "PEN", "CLP"],
    supportedPaymentMethods: ["Credit Cards", "PIX", "UPI", "Mercado Pago", "OXXO", "Boleto"],
    technicalDetails: [
      "REST API with local market focus",
      "SDKs for major programming languages",
      "PCI DSS Level 1 compliant",
      "Average transaction latency: 180ms",
      "Local acquiring in emerging markets",
      "Specialized in Latin America and India"
    ]
  },
  {
    id: "chase-orbital",
    name: "Chase Orbital",
    logo: "🚨",
    description: "⚠️ Orbital is scheduled for deprecation in H1 2026. Chase is not supporting new Orbital merchant accounts. Existing and future merchants will integrate with CommercePlatform.",
    features: ["Legacy gateway", "Scheduled deprecation", "Enterprise solutions", "US focus"],
    score: 0,
    supportedCurrencies: ["USD", "EUR", "GBP", "CAD"],
    supportedPaymentMethods: ["Credit Cards", "ACH", "Wire Transfer"],
    technicalDetails: [
      "Legacy API (deprecation scheduled)",
      "Limited SDK support",
      "PCI DSS Level 1 compliant",
      "Average transaction latency: 250ms",
      "Chase banking integration",
      "⚠️ Scheduled for deprecation H1 2026"
    ]
  },
  {
    id: "tsys",
    name: "TSYS",
    logo: "🇺🇸",
    description: "U.S. only.",
    features: ["US-only processing", "Enterprise solutions", "Card processing", "Merchant services"],
    score: 0,
    supportedCurrencies: ["USD"],
    supportedPaymentMethods: ["Credit Cards", "ACH", "eCheck"],
    technicalDetails: [
      "REST API and legacy systems",
      "SDKs for major programming languages",
      "PCI DSS Level 1 compliant",
      "Average transaction latency: 200ms",
      "US-only processing capabilities",
      "Enterprise merchant services"
    ]
  },
  {
    id: "amazon-pay-v2",
    name: "Amazon Pay v2",
    logo: "📦",
    description: "Popular payment method for Amazon customers. Available for U.S., Europe, UK.",
    features: ["Amazon customer base", "Regional availability", "Easy checkout", "Trusted brand"],
    score: 0,
    supportedCurrencies: ["USD", "EUR", "GBP", "JPY"],
    supportedPaymentMethods: ["Amazon Pay", "Credit Cards"],
    technicalDetails: [
      "Amazon Pay API v2",
      "SDKs for major programming languages",
      "PCI DSS compliant through Amazon",
      "Average transaction latency: 150ms",
      "Amazon customer authentication",
      "Available in US, Europe, UK"
    ]
  },
  {
    id: "cardconnect",
    name: "CardConnect",
    logo: "🔗",
    description: "U.S. and Canada only.",
    features: ["US and Canada focus", "Payment processing", "Merchant services", "API integration"],
    score: 0,
    supportedCurrencies: ["USD", "CAD"],
    supportedPaymentMethods: ["Credit Cards", "ACH", "eCheck"],
    technicalDetails: [
      "REST API with comprehensive documentation",
      "SDKs for major programming languages",
      "PCI DSS Level 1 compliant",
      "Average transaction latency: 180ms",
      "US and Canada processing only",
      "Merchant services integration"
    ]
  },
  {
    id: "commerce-hub",
    name: "Commerce Hub",
    logo: "🏬",
    description: "A full-service payment management platform.",
    features: ["Full-service platform", "Payment management", "Enterprise solutions", "Global processing"],
    score: 0,
    supportedCurrencies: ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CHF"],
    supportedPaymentMethods: ["Credit Cards", "PayPal", "Apple Pay", "Google Pay", "ACH"],
    technicalDetails: [
      "Comprehensive API suite",
      "SDKs for major programming languages",
      "PCI DSS Level 1 compliant",
      "Average transaction latency: 160ms",
      "Full-service payment management",
      "Enterprise-grade solutions"
    ]
  },
  {
    id: "gocardless",
    name: "GoCardless",
    logo: "💰",
    description: "Specializes in direct debit payment methods. Alternative for ACH, BACS, BECS, SEPA especially for SMBs.",
    features: ["Direct debit specialist", "SMB focus", "ACH alternative", "SEPA payments"],
    score: 0,
    supportedCurrencies: ["USD", "EUR", "GBP", "CAD", "AUD", "SEK", "DKK", "NOK"],
    supportedPaymentMethods: ["ACH", "BACS", "BECS", "SEPA Direct Debit", "iDEAL", "Bank Transfer"],
    technicalDetails: [
      "REST API focused on direct debit",
      "SDKs for major programming languages",
      "Bank-level security standards",
      "Average transaction latency: 120ms",
      "Specialized in recurring payments",
      "Direct debit expertise for SMBs"
    ]
  },
  {
    id: "freedompay",
    name: "FreedomPay",
    logo: "🛒",
    description: "Certified for POS/card present transactions. Online transaction certification in progress. Specific for omnichannel (not full-on gateway).",
    features: ["POS specialist", "Omnichannel", "Card present", "Retail focus"],
    score: 0,
    supportedCurrencies: ["USD", "EUR", "GBP", "CAD"],
    supportedPaymentMethods: ["Credit Cards", "Apple Pay", "Google Pay", "Contactless"],
    technicalDetails: [
      "POS-focused API",
      "Omnichannel payment orchestration",
      "PCI DSS Level 1 compliant",
      "Average transaction latency: 140ms",
      "Card present transaction specialist",
      "Online certification in progress"
    ]
  }
];