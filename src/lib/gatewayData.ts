export interface PaymentGateway {
  id: string;
  name: string;
  logo: string;
  description: string;
  features: string[];
  isRecommended?: boolean;
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
  "Visa", "MasterCard", "American Express", "Discover", "PayPal", "Apple Pay",
  "Google Pay", "Bank Transfer", "SEPA Direct Debit", "iDEAL", "Klarna",
  "Afterpay", "WeChat Pay", "Alipay", "Venmo", "Zelle", "ACH", "Wire Transfer",
  "BACS", "Faster Payments", "SOFORT", "Giropay", "Bancontact", "EPS",
  "Przelewy24", "Multibanco", "BLIK", "Trustly", "Paysafecard", "Skrill"
];

export const gatewayDatabase: PaymentGateway[] = [
  {
    id: "adyen",
    name: "Adyen",
    logo: "💳",
    description: "End-to-end payments, data, and financial management platform",
    features: ["Global coverage", "Unified commerce", "Advanced fraud protection", "Local payment methods"],
    score: 0,
    supportedCurrencies: ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CHF", "SEK", "NOK", "DKK", "SGD", "HKD", "BRL", "MXN", "INR", "CNY", "KRW", "ZAR", "RUB", "PLN", "CZK", "HUF", "THB", "MYR"],
    supportedPaymentMethods: ["Visa", "MasterCard", "American Express", "Discover", "PayPal", "Apple Pay", "Google Pay", "Bank Transfer", "SEPA Direct Debit", "iDEAL", "Klarna", "Afterpay", "WeChat Pay", "Alipay", "SOFORT", "Giropay", "Bancontact", "EPS", "Przelewy24", "Multibanco"],
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
    supportedPaymentMethods: ["PayPal", "Visa", "MasterCard", "American Express", "Discover", "Bank Transfer", "Apple Pay", "Google Pay", "Venmo", "PayPal Credit", "SEPA Direct Debit", "SOFORT", "iDEAL", "Bancontact", "Giropay"],
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
    description: "Payment management platform with fraud management",
    features: ["Enterprise-grade security", "Global payment processing", "Risk management", "Token management"],
    score: 0,
    supportedCurrencies: ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CHF", "SEK", "NOK", "DKK", "SGD", "HKD", "BRL", "MXN", "INR", "CNY", "KRW", "ZAR", "RUB", "PLN", "CZK", "HUF", "THB"],
    supportedPaymentMethods: ["Visa", "MasterCard", "American Express", "Discover", "PayPal", "Apple Pay", "Google Pay", "Bank Transfer", "ACH", "Wire Transfer", "SEPA Direct Debit", "JCB", "Diners Club", "UnionPay"],
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
    description: "Payment infrastructure for the internet",
    features: ["Developer-friendly APIs", "Global payments", "Subscription billing", "Marketplace payments"],
    score: 0,
    supportedCurrencies: ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CHF", "SEK", "NOK", "DKK", "SGD", "HKD", "BRL", "MXN", "INR", "CNY", "KRW", "ZAR", "PLN", "CZK", "HUF", "THB", "MYR"],
    supportedPaymentMethods: ["Visa", "MasterCard", "American Express", "Discover", "Apple Pay", "Google Pay", "Bank Transfer", "ACH", "SEPA Direct Debit", "iDEAL", "Klarna", "Afterpay", "Alipay", "WeChat Pay", "SOFORT", "Giropay", "Bancontact", "BLIK", "Przelewy24"],
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
    description: "Global payment technology company",
    features: ["Omnichannel payments", "Risk management", "Alternative payments", "Enterprise solutions"],
    score: 0,
    supportedCurrencies: ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CHF", "SEK", "NOK", "DKK", "SGD", "HKD", "BRL", "MXN", "INR", "CNY", "KRW", "ZAR", "RUB", "PLN", "CZK", "HUF"],
    supportedPaymentMethods: ["Visa", "MasterCard", "American Express", "Discover", "PayPal", "Apple Pay", "Google Pay", "Bank Transfer", "SEPA Direct Debit", "iDEAL", "Klarna", "SOFORT", "Giropay", "Bancontact", "UnionPay", "JCB"],
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
    description: "Payment gateway service provider",
    features: ["Fraud detection", "Recurring billing", "Customer profiles", "Virtual terminal"],
    score: 0,
    supportedCurrencies: ["USD", "CAD", "EUR", "GBP", "AUD"],
    supportedPaymentMethods: ["Visa", "MasterCard", "American Express", "Discover", "JCB", "Diners Club", "ACH", "eCheck", "PayPal", "Apple Pay", "Bank Transfer"],
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
    supportedPaymentMethods: ["Visa", "MasterCard", "American Express", "Discover", "Apple Pay", "Google Pay", "Cash", "Gift Cards", "ACH", "Bank Transfer"],
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
    description: "Full-stack payment platform",
    features: ["Mobile-first", "Global reach", "Marketplace payments", "Subscription billing"],
    score: 0,
    supportedCurrencies: ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CHF", "SEK", "NOK", "DKK", "SGD", "HKD", "BRL", "MXN", "THB", "MYR"],
    supportedPaymentMethods: ["Visa", "MasterCard", "American Express", "Discover", "PayPal", "Apple Pay", "Google Pay", "Venmo", "Bank Transfer", "SEPA Direct Debit", "iDEAL", "SOFORT", "Klarna"],
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
  }
];