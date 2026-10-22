/* Skills taxonomy used by the rule-based scorer.
   Each entry: "Display name|alias|alias" grouped by family. Matching is case-insensitive
   with word boundaries, so aliases should be written the way people type them. */

const RAW = {
  language: [
    'Python', 'Java', 'JavaScript|js|ecmascript', 'TypeScript|ts', 'C++|cpp', 'C#|c sharp|csharp', 'C', 'Go|golang',
    'Rust', 'Kotlin', 'Swift', 'Objective-C', 'Ruby', 'PHP', 'Scala', 'R', 'MATLAB', 'Perl', 'Dart', 'Bash|shell scripting|shell script',
    'PowerShell', 'SQL', 'PL/SQL|plsql', 'T-SQL|tsql', 'VBA', 'Solidity', 'Haskell', 'Elixir', 'Lua',
  ],
  frontend: [
    'React|react.js|reactjs', 'Next.js|nextjs', 'Angular|angularjs', 'Vue|vue.js|vuejs', 'Svelte', 'Redux', 'HTML|html5',
    'CSS|css3', 'Sass|scss', 'Tailwind|tailwind css', 'Bootstrap', 'jQuery', 'Webpack', 'Vite', 'Figma', 'Storybook',
    'Responsive design', 'Accessibility|a11y|wcag',
  ],
  backend: [
    'Node.js|nodejs|node', 'Express|express.js|expressjs', 'NestJS', 'Django', 'Flask', 'FastAPI', 'Spring|spring boot|springboot',
    '.NET|dotnet|asp.net', 'Rails|ruby on rails', 'Laravel', 'GraphQL', 'REST|rest api|restful|rest apis', 'gRPC',
    'Microservices|microservice', 'Kafka|apache kafka', 'RabbitMQ', 'Redis', 'Elasticsearch|elastic search', 'WebSockets|websocket',
  ],
  data_store: [
    'PostgreSQL|postgres', 'MySQL', 'MongoDB|mongo', 'Oracle', 'SQL Server|mssql|microsoft sql server', 'SQLite', 'Cassandra',
    'DynamoDB', 'Firebase|firestore', 'Snowflake', 'BigQuery|big query', 'Redshift', 'Databricks', 'Supabase',
  ],
  cloud: [
    'AWS|amazon web services', 'Azure|microsoft azure', 'GCP|google cloud|google cloud platform', 'Docker', 'Kubernetes|k8s',
    'Terraform', 'Ansible', 'Jenkins', 'GitHub Actions', 'CI/CD|ci cd|continuous integration', 'Linux', 'Git|github|gitlab',
    'Lambda|aws lambda', 'EC2', 'S3', 'Serverless', 'Nginx', 'Prometheus', 'Grafana', 'DevOps',
  ],
  mobile: ['Android', 'iOS', 'React Native', 'Flutter', 'Jetpack Compose', 'SwiftUI', 'Xamarin'],
  data: [
    'Excel|ms excel|microsoft excel|advanced excel', 'Power BI|powerbi', 'Tableau', 'Looker', 'Google Analytics|ga4',
    'Pandas', 'NumPy|numpy', 'Spark|pyspark|apache spark', 'Hadoop', 'Airflow|apache airflow', 'dbt', 'ETL|elt',
    'Data visualization|data visualisation|dashboards|dashboard', 'Statistics|statistical analysis', 'A/B testing|ab testing|a/b tests|experimentation',
    'SQL window functions|window functions', 'Data modeling|data modelling', 'Data analysis|data analytics|data analyst', 'Data warehousing|data warehouse',
    'Forecasting', 'Regression', 'Hypothesis testing', 'SAS', 'SPSS', 'Alteryx',
  ],
  ml: [
    'Machine learning|ml', 'Deep learning', 'NLP|natural language processing', 'Computer vision', 'TensorFlow', 'PyTorch',
    'scikit-learn|sklearn', 'LLM|llms|large language models', 'Generative AI|genai|gen ai', 'Prompt engineering', 'MLOps',
    'Recommendation systems|recommender systems', 'Time series',
  ],
  quality: ['Selenium', 'Cypress', 'Playwright', 'Jest', 'JUnit', 'Pytest', 'Unit testing|unit tests', 'Test automation|automation testing', 'Manual testing', 'API testing', 'Postman', 'JIRA|jira'],
  security: ['Cybersecurity|cyber security|information security', 'OWASP', 'Penetration testing|pen testing', 'IAM', 'SIEM', 'ISO 27001', 'SOC 2|soc2'],
  product: [
    'Product management', 'Roadmapping|product roadmap|roadmap', 'User research', 'Agile', 'Scrum', 'Kanban', 'Stakeholder management',
    'Requirements gathering', 'PRD|product requirements', 'Wireframing|wireframes', 'Prototyping', 'UX design|ux', 'UI design|ui',
    'User stories', 'Usability testing|usability tests|usability test', 'Design systems|design system', 'Interaction design',
    'Go-to-market|gtm|go to market', 'OKRs|okr', 'Product analytics', 'Mixpanel', 'Amplitude',
  ],
  business: [
    'Project management', 'PMP', 'Business analysis', 'Financial modeling|financial modelling', 'Budgeting', 'Forecasting and planning',
    'Accounting', 'Tally', 'GST', 'Taxation', 'Audit|auditing', 'IFRS', 'GAAP', 'SAP', 'ERP', 'Salesforce', 'HubSpot', 'CRM|crm software|salesforce|hubspot|zoho crm|leadsquared|bullhorn|pipedrive|freshsales',
    'Supply chain', 'Procurement', 'Logistics', 'TMS|transportation management system', 'Rostering|roster|rosters|rota|rotas|shift scheduling', 'POS systems|point of sale|pos system|pos', 'Inventory management', 'Vendor management', 'Operations management',
    'Six Sigma|lean six sigma', 'Negotiation', 'Business development', 'Lead generation', 'Account management', 'B2B sales|b2b sales',
    'Customer success', 'Customer service|customer support', 'Recruitment|recruiting|talent acquisition', 'Payroll', 'HRIS',
    'Employee engagement', 'Onboarding', 'Sourcing|candidate sourcing', 'Naukri', 'LinkedIn Recruiter|linkedin recruiter', 'Boolean search',
    'TDS', 'Ind AS|ind-as', 'Income tax', 'Reconciliation|reconciliations|bank reconciliation', 'MIS reporting|mis reports|mis', 'Financial reporting|financial statements',
    'Field sales', 'Distributor management|distribution management|distributors', 'Retail sales', 'Target achievement|sales targets|sales target|monthly target|monthly targets', 'Cold calling',
    'Voice process|international voice|inbound calls|outbound calls', 'Chat support|non-voice|email support', 'Ticketing|zendesk|freshdesk', 'SaaS',
  ],
  marketing: [
    'SEO|search engine optimization', 'SEM', 'Google Ads|adwords', 'Meta Ads|facebook ads', 'Content marketing', 'Copywriting',
    'Email marketing', 'Social media marketing|social media', 'Performance marketing|paid acquisition|paid media|paid marketing|paid campaigns|paid social', 'Marketing automation', 'Brand management',
    'Market research', 'Canva', 'Adobe Photoshop|photoshop', 'Adobe Illustrator|illustrator', 'Premiere Pro', 'After Effects',
  ],
  design_eng: ['AutoCAD', 'SolidWorks', 'CATIA', 'ANSYS', 'Revit', 'STAAD Pro|staad', 'PLC', 'SCADA', 'Embedded systems', 'IoT|internet of things', 'VLSI', 'Verilog',
    'GD&T|geometric dimensioning and tolerancing|geometric dimensioning', 'Sheet metal design|sheet metal', 'Creo|pro/e|pro-e', 'NX|siemens nx|unigraphics', 'FEA|finite element analysis', 'DFM|design for manufacturing', 'Quality control|qc', 'Root cause analysis|rca'],
  health: ['Patient care', 'EMR|ehr|electronic health records|electronic patient record', 'Clinical research', 'Pharmacovigilance', 'GMP', 'Medical coding',
    'ICU|intensive care|critical care', 'IV cannulation|cannulation', 'Medication administration|giving medicines|medicines management', 'Acute care|acute|ICU|intensive care|critical care|emergency department|A&E', 'BLS|basic life support', 'Infection control'],
  soft: ['Communication|communication skills', 'Leadership', 'Team management|people management', 'Problem solving|problem-solving', 'Presentation skills|presentations', 'Mentoring'],
  teaching: ['Lesson planning', 'Classroom management', 'CBSE', 'ICSE', 'Smart board|smartboard', 'Curriculum design|curriculum development', 'Student assessment|assessments'],
};

export const SKILLS = Object.entries(RAW).flatMap(([family, list]) =>
  list.map((row) => {
    const [name, ...aliases] = row.split('|');
    return { name, family, terms: [name.toLowerCase(), ...aliases.map((a) => a.toLowerCase())] };
  })
);

/* Words that are too short or too common to trust on their own. Matched only when written exactly. */
export const AMBIGUOUS = new Set(['c', 'r', 'go', 'ui', 'ux', 'ml', 'ts', 'js', 'node', 'spring', 'ga4', 'audit', 'gst', 'ios', 'nx', 'qc', 'mis', 'rca', 'fea', 'dfm', 'tds']);

export const STOPWORDS = new Set(('a about above after again against all also an and any are as at be because been before being below between both but by can could did do does doing down during each few for from further had has have having he her here hers him his how i if in into is it its itself just me more most must my no nor not now of off on once only or other our ours out over own same she should so some such than that the their them then there these they this those through to too under until up very was we were what when where which while who whom why will with would you your yours role job team work working company candidate candidates experience years year looking ability able strong good excellent knowledge understanding skills skill required requirements preferred responsibilities responsible including include includes well within across based new help opportunity join us apply position day days time per etc using use used make making ensure provide support environment business plus nice equivalent related relevant degree minimum least global world best please like highly key across').split(/\s+/));

/* A CV that shows one of these skills shows the broader skill too. */
export const IMPLIED_BY = {
  'Performance marketing': ['Google Ads', 'Meta Ads', 'SEM'],
  'Data analysis': ['Pandas', 'SQL window functions'],
};
