/* Question bank for the Interview Kit. Real interview questions, written by hand, keyed to the skills in skills.js.
   Each hint says what a strong answer covers, so the person learns the content and not just the question.
   Nothing here is generated or guessed at runtime. */

const Q = (q, hint) => ({ q, hint });

export const SKILL_Q = {
  'python': [
    Q('What is the difference between a list, a tuple, a set and a dict, and when would you pick each?', 'Lists are ordered and mutable; tuples are ordered and immutable (safe as dict keys); sets hold unique items with fast membership tests; dicts map keys to values with O(1) lookups on average.'),
    Q('How would you clean a messy dataset in Python? Walk me through your first five steps.', 'Load and inspect (shape, dtypes, nulls), fix types, handle missing values and duplicates, standardise text and dates, then validate with checks and counts before and after.'),
  ],
  'java': [
    Q('Explain how HashMap works internally and what happens on a collision.', 'Hash of the key picks a bucket; collisions chain in a linked list or tree (Java 8+); equals() and hashCode() must agree; resize happens when the load factor is exceeded.'),
    Q('What is the difference between an abstract class and an interface in Java?', 'Interfaces define a contract (default methods allowed), classes can implement many; abstract classes can hold state and constructors but only one can be extended.'),
  ],
  'javascript': [
    Q('Explain closures and give a practical example.', 'A function that remembers variables from the scope where it was created. Examples: private counters, once(), memoisation, event handlers inside loops.'),
    Q('How does the event loop work? What runs first: a promise callback or setTimeout(0)?', 'Call stack, then microtasks (promises) fully drained, then one macrotask (timers, I/O). Promise callbacks run before setTimeout(0).'),
  ],
  'typescript': [
    Q('Why use TypeScript over JavaScript, and what are its limits?', 'Compile-time safety, better tooling and refactoring, self-documenting contracts. Limits: types are erased at runtime, so external data still needs validation.'),
  ],
  'sql': [
    Q('Explain the difference between INNER, LEFT and FULL joins with an example.', 'INNER keeps matches only; LEFT keeps all left rows with NULLs where nothing matches; FULL keeps both sides. Mention the common bug of filtering the right table in WHERE and turning a LEFT join into an INNER join.'),
    Q('How would you find the second highest salary in each department?', 'DENSE_RANK() OVER (PARTITION BY dept ORDER BY salary DESC) = 2 in a subquery or CTE. Mention ties and why DENSE_RANK, not ROW_NUMBER.'),
  ],
  'sql window functions': [
    Q('When would you use ROW_NUMBER, RANK and DENSE_RANK? Show how each treats ties.', 'ROW_NUMBER gives unique numbers; RANK leaves gaps after ties; DENSE_RANK does not. Use PARTITION BY for groups and ORDER BY for ranking.'),
    Q('How would you calculate a running total and a month-over-month change?', 'SUM(x) OVER (ORDER BY month) for the running total; LAG(x) OVER (ORDER BY month) for the previous month, then (x - lag) / lag.'),
  ],
  'r': [
    Q('How do you go from raw data to a model in R? Name the packages you would use.', 'tidyverse (dplyr, tidyr) for wrangling, ggplot2 for exploring, then lm/glm or tidymodels; check assumptions and validate on held-out data.'),
  ],
  'react': [
    Q('Explain how useEffect works and the most common mistakes with it.', 'Runs after render when dependencies change; the cleanup function runs before the next effect. Mistakes: missing dependencies, infinite loops from objects created in render, using effects for derived state.'),
    Q('How do you stop unnecessary re-renders in a large React app?', 'Measure first with the profiler. Then React.memo, useMemo/useCallback for stable props, splitting state, lifting it down, and virtualising long lists.'),
  ],
  'angular': [
    Q('Explain dependency injection in Angular and why it matters.', 'Services are provided to components by the injector, so they can be shared, swapped and mocked in tests. Mention providedIn root and scoping.'),
  ],
  'vue': [
    Q('Explain how Vue reactivity works and when you would use computed over watch.', 'Reactive proxies track dependencies. Computed is cached and derives values; watch is for side effects such as API calls.'),
  ],
  'node.js': [
    Q('Node is single threaded. How does it handle many concurrent requests?', 'Non-blocking I/O with the event loop and libuv thread pool. CPU-heavy work blocks it, so use worker threads or a queue.'),
  ],
  'django': [
    Q('How does the Django ORM avoid the N+1 query problem?', 'select_related for foreign keys (joins) and prefetch_related for many-to-many (extra query); check with the query log or debug toolbar.'),
  ],
  'spring': [
    Q('Explain how Spring Boot auto-configuration works.', 'Starters bring dependencies; conditional beans activate when classes or properties are present; you override with your own beans or application properties.'),
  ],
  'rest': [
    Q('How do you design a REST API for pagination, errors and versioning?', 'Cursor or page-based pagination with limits; consistent error body and correct status codes; version in the path or header; idempotent PUT and DELETE.'),
    Q('What is the difference between PUT and PATCH, and what makes an operation idempotent?', 'PUT replaces the resource, PATCH changes part of it. Idempotent means repeating the call has the same effect as doing it once.'),
  ],
  'graphql': [
    Q('When would you choose GraphQL over REST, and what are the trade-offs?', 'Clients ask for exactly what they need and avoid over-fetching. Trade-offs: caching is harder, query cost and N+1 need guarding.'),
  ],
  'microservices': [
    Q('How do you handle data consistency between microservices?', 'Avoid distributed transactions; use sagas, outbox pattern and idempotent events; accept eventual consistency where the business allows it.'),
  ],
  'kafka': [
    Q('How do partitions and consumer groups work in Kafka, and how is ordering preserved?', 'Ordering is guaranteed within a partition only. Each partition is read by one consumer in a group. Choose the key so related events go to one partition.'),
  ],
  'redis': [
    Q('What would you use Redis for, and what happens if it restarts?', 'Caching, sessions, rate limits, queues. Without persistence (RDB/AOF) data is lost, so never treat it as the only source of truth.'),
  ],
  'postgresql': [
    Q('How would you find and fix a slow query in PostgreSQL?', 'EXPLAIN (ANALYZE) to see the plan, look for sequential scans on big tables, add or fix indexes, check statistics and avoid functions on indexed columns.'),
  ],
  'mysql': [
    Q('Explain indexes in MySQL and when an index will not be used.', 'B-tree indexes speed lookups and sorts. Not used with functions on the column, leading wildcards in LIKE, type mismatches, or low-selectivity columns.'),
  ],
  'mongodb': [
    Q('When would you embed documents and when would you reference them in MongoDB?', 'Embed for data read together that does not grow without limit; reference for large, shared or frequently changing data.'),
  ],
  'snowflake': [
    Q('How does Snowflake separate storage and compute, and why does it matter for cost?', 'Warehouses scale independently and can suspend when idle; you pay for compute time, so right-size and auto-suspend.'),
  ],
  'aws': [
    Q('How would you design a highly available web application on AWS?', 'Multiple availability zones, load balancer, auto scaling group, managed database with a standby, S3 for static files, CloudFront in front, health checks and backups.'),
    Q('What is the difference between IAM users, roles and policies?', 'Policies define permissions; users are long-lived identities; roles are assumed temporarily by services or users. Prefer roles and least privilege.'),
  ],
  'azure': [
    Q('How would you secure access to resources in Azure?', 'Entra ID with role-based access control, managed identities instead of secrets, Key Vault, network rules and Defender alerts.'),
  ],
  'gcp': [
    Q('When would you choose BigQuery, Cloud SQL or Firestore on Google Cloud?', 'BigQuery for analytics at scale, Cloud SQL for relational transactions, Firestore for flexible documents with real-time sync.'),
  ],
  'docker': [
    Q('What is the difference between an image and a container, and how do you keep images small?', 'An image is a read-only template, a container is a running instance. Use slim base images, multi-stage builds and a .dockerignore.'),
  ],
  'kubernetes': [
    Q('A pod keeps crashing. How do you debug it?', 'kubectl describe pod and logs (with --previous), check events, resource limits (OOMKilled), probes, config and secrets, and image pull errors.'),
  ],
  'terraform': [
    Q('What is Terraform state and how do you manage it safely in a team?', 'State maps config to real resources. Use a remote backend with locking, never edit by hand, separate states per environment.'),
  ],
  'ci/cd': [
    Q('Describe a CI/CD pipeline you built or would build. What stages and checks does it have?', 'Build, lint, unit tests, security scan, package, deploy to staging, smoke tests, then gated production release with rollback.'),
  ],
  'git': [
    Q('Explain merge versus rebase and when you would use each.', 'Merge keeps history and adds a merge commit; rebase rewrites commits for a linear history. Never rebase shared branches.'),
  ],
  'linux': [
    Q('A server is slow. Which commands do you run first?', 'top/htop for CPU and memory, df -h and du for disk, iostat, free -m, ss or netstat, and check logs in /var/log or journalctl.'),
  ],
  'android': [
    Q('Explain the Android activity lifecycle and what you do on configuration change.', 'onCreate, onStart, onResume and back down; use ViewModel to survive rotation and save only small UI state.'),
  ],
  'ios': [
    Q('How does memory management work in Swift, and what is a retain cycle?', 'ARC counts strong references. Closures capturing self strongly can create a cycle; break it with weak or unowned.'),
  ],
  'flutter': [
    Q('How do you manage state in a Flutter app and how do you choose an approach?', 'setState for local state; Provider, Riverpod or Bloc for shared state. Choose by app size, testability and team familiarity.'),
  ],
  'react native': [
    Q('How does React Native differ from a webview app, and where does performance suffer?', 'It renders native components through a bridge or the new architecture. Heavy lists and animations on the JS thread are the common issue.'),
  ],
  'excel': [
    Q('When would you use XLOOKUP or INDEX-MATCH instead of VLOOKUP?', 'They look left and right, do not break when columns move, and XLOOKUP handles missing values and exact match by default.'),
    Q('How would you build a monthly summary from 100,000 rows of transactions?', 'Clean into a table, build a PivotTable or use SUMIFS, add slicers, check totals against the source and avoid volatile formulas.'),
  ],
  'power bi': [
    Q('Explain the difference between a calculated column and a measure in Power BI.', 'A column is calculated per row and stored; a measure is calculated at query time in the filter context, so it responds to slicers. Prefer measures for aggregates.'),
    Q('How would you design a dashboard for senior managers?', 'Start with the decisions they make, three to five KPIs at the top, trends and comparisons below, drill-down on request, and consistent definitions.'),
  ],
  'tableau': [
    Q('What is the difference between a live connection and an extract in Tableau?', 'Live queries the source each time and is always current; an extract is a snapshot that is faster and works offline. Choose by freshness needs and source load.'),
    Q('What are LOD expressions and when do you use them?', 'FIXED, INCLUDE and EXCLUDE compute at a different level of detail than the view, for example customer-level first order date used in a monthly chart.'),
  ],
  'looker': [
    Q('How does LookML help keep metrics consistent across a company?', 'Dimensions and measures are defined once in a governed model, so every dashboard uses the same definition.'),
  ],
  'google analytics': [
    Q('How would you diagnose a drop in conversions using Google Analytics?', 'Segment by channel, device, landing page and new versus returning, check tracking and releases first, then compare funnel steps with the previous period.'),
  ],
  'pandas': [
    Q('What is the difference between merge, join and concat in pandas?', 'merge joins on keys like SQL; join defaults to the index; concat stacks along an axis. Check for duplicate keys after a merge.'),
  ],
  'spark': [
    Q('How do you deal with data skew in Spark?', 'Salt the hot keys, broadcast the small side of a join, repartition, and check the Spark UI for uneven tasks.'),
  ],
  'airflow': [
    Q('How do you make an Airflow DAG reliable and safe to re-run?', 'Idempotent tasks, retries with backoff, clear dependencies, sensors for upstream data, alerts on failure and backfills that do not duplicate data.'),
  ],
  'dbt': [
    Q('How do you test and document models in dbt?', 'Generic tests (unique, not_null, relationships), custom tests for business rules, descriptions in YAML and lineage from the docs site.'),
  ],
  'etl': [
    Q('Describe an ETL pipeline you built. How did you handle failures and bad data?', 'Extract with checkpoints, validate and quarantine bad rows, load idempotently, monitor row counts and freshness, and alert on anomalies.'),
  ],
  'a/b testing': [
    Q('How do you design an A/B test and decide when to stop it?', 'Define one primary metric, compute the sample size from the effect you care about and the baseline, randomise, run to the planned size and avoid peeking.'),
    Q('The test shows a 3% lift with p = 0.04. Do you ship? What else do you check?', 'Practical significance, guardrail metrics, sample ratio mismatch, novelty effects, segments, and whether the effect repeats.'),
  ],
  'statistics': [
    Q('Explain a p-value and a confidence interval to a non-technical manager.', 'The p-value is how surprising the data would be if nothing was happening. A confidence interval is the range of plausible values for the true effect.'),
    Q('When would you use the median instead of the mean?', 'Skewed data or outliers such as salaries and order values. Say what you would report to the business and why.'),
  ],
  'data visualization': [
    Q('How do you choose the right chart for a message?', 'Trend: line; comparison: bars; part to whole: stacked bar or table; relationship: scatter. Remove clutter and label the takeaway.'),
  ],
  'data modeling': [
    Q('Explain star schema versus snowflake schema and when you would use each.', 'Star: a central fact table joined to denormalised dimensions, simple and fast for BI. Snowflake normalises dimensions and saves space but needs more joins.'),
  ],
  'data warehousing': [
    Q('What is a slowly changing dimension and how do you handle it?', 'Type 1 overwrites, Type 2 adds a new row with validity dates to keep history, Type 3 keeps previous value in a column.'),
  ],
  'forecasting': [
    Q('How would you forecast next quarter sales and how would you know if the forecast is good?', 'Look at trend and seasonality, start with a simple baseline, backtest on held-out periods, and measure with MAPE or WAPE.'),
  ],
  'machine learning': [
    Q('Explain overfitting and how you detect and reduce it.', 'High training score but poor validation score. Use cross-validation, regularisation, simpler models, more data and early stopping.'),
    Q('How do you choose a metric for an imbalanced classification problem?', 'Accuracy misleads. Use precision, recall, F1 or PR-AUC, and choose the threshold from the business cost of each error.'),
  ],
  'deep learning': [
    Q('What is the vanishing gradient problem and how is it reduced?', 'Gradients shrink through many layers so early layers barely learn. ReLU activations, residual connections, normalisation and careful initialisation help.'),
  ],
  'nlp': [
    Q('How would you build a classifier for customer support tickets?', 'Clean text, start with TF-IDF and logistic regression as a baseline, then try a fine-tuned transformer if it is worth the cost; evaluate per class.'),
  ],
  'llm': [
    Q('How do you reduce hallucinations in an LLM application?', 'Ground answers with retrieval, limit scope with clear instructions, require citations, validate outputs and keep a human check for risky cases.'),
  ],
  'generative ai': [
    Q('Where would generative AI help in this role, and where would you not trust it?', 'Drafting and summarising are good fits; facts, numbers and decisions need checking. Mention privacy of company data.'),
  ],
  'selenium': [
    Q('How do you make Selenium tests stable and not flaky?', 'Explicit waits, stable locators (ids or data attributes), independent test data, page objects and running in a clean environment.'),
  ],
  'test automation': [
    Q('What do you automate and what do you leave manual?', 'Automate stable, repeated, high-value paths such as regression and smoke tests. Keep exploratory and one-off checks manual. Follow the test pyramid.'),
  ],
  'manual testing': [
    Q('You are given a login page. How do you test it?', 'Valid and invalid inputs, boundaries, lockout, password reset, session expiry, security (injection), usability, accessibility and different browsers and devices.'),
  ],
  'unit testing': [
    Q('What makes a good unit test, and how do you test code that calls an external service?', 'Fast, isolated, one behaviour, readable names. Replace the service with a mock or fake and test the contract separately.'),
  ],
  'agile': [
    Q('How does your team run a sprint and what did you do to improve it?', 'Planning, daily stand-up, review, retrospective; give a real example of a change that reduced carry-over or cycle time.'),
  ],
  'scrum': [
    Q('What are the Scrum roles and events, and what goes wrong when the product owner is absent?', 'Product Owner, Scrum Master, Developers; sprint planning, daily, review, retrospective. Without the PO, priorities and acceptance are unclear and work gets rebuilt.'),
  ],
  'product management': [
    Q('How do you decide what to build next?', 'Start from user problems and business goals, size impact and effort (RICE or similar), check with data and users, and say what you chose not to do.'),
    Q('A key metric dropped 10% this week. What do you do?', 'Confirm it is real (tracking, data), segment to find where, check recent releases and external causes, form hypotheses, then decide on a fix or rollback.'),
  ],
  'roadmapping': [
    Q('How do you build a roadmap and say no to stakeholders?', 'Tie items to goals, use themes with rough timing, show trade-offs openly and explain what would have to be dropped to add something.'),
  ],
  'user research': [
    Q('How would you learn why users drop off during signup?', 'Funnel data to find the step, then five to eight interviews or session recordings to find the reason, then test a change.'),
  ],
  'stakeholder management': [
    Q('Tell me about a stakeholder who disagreed with your plan. What did you do?', 'Understand their concern, bring data, find the common goal, agree what you will measure and keep them updated.'),
  ],
  'financial modeling': [
    Q('Walk me through how you would build a three-statement model.', 'Assumptions drive the income statement; balance sheet and cash flow link to it; the balance sheet must balance; run scenarios and sensitivities.'),
    Q('How do you value a company using a DCF, and what are its weak points?', 'Forecast free cash flow, discount at WACC, add terminal value. Highly sensitive to the terminal value and discount rate.'),
  ],
  'accounting': [
    Q('Walk me through the month-end close. What are the main reconciliations?', 'Accruals and prepayments, bank, receivables and payables sub-ledgers to control accounts, depreciation, then review variances against budget.'),
  ],
  'gst': [
    Q('Explain input tax credit under GST and when it can be denied.', 'Credit on GST paid on business purchases, set off against output tax. Needs valid invoice, receipt of goods or services, supplier filing and payment; blocked credits apply to some items.'),
  ],
  'taxation': [
    Q('How do you make sure tax filings are correct and on time, and how do you keep the liability as low as the law allows?', 'A compliance calendar, reconciliations to the books before filing, use of deductions and exemptions the law allows, documentation for every position, and review of notices.'),
  ],
  'audit': [
    Q('How do you plan an audit and decide what to test?', 'Understand the business and risks, set materiality, test controls where reliable, sample transactions where risk is higher and document evidence.'),
  ],
  'sap': [
    Q('Which SAP modules have you used and how do they connect?', 'Name the real modules (FI, CO, MM, SD...) and describe one flow, such as purchase order to goods receipt to invoice to payment posting in FI.'),
  ],
  'salesforce': [
    Q('How do you keep Salesforce data clean and useful for a sales team?', 'Required fields and validation rules, deduplication, simple stages, regular reports for the team and removing fields nobody uses.'),
  ],
  'crm': [
    Q('How do you use a CRM to manage a pipeline and forecast?', 'Clear stages with exit criteria, next step on every deal, weekly review of stale deals, forecast by stage conversion rates.'),
  ],
  'supply chain': [
    Q('Demand suddenly doubles. What do you do across the supply chain?', 'Check true demand, confirm supplier capacity and lead times, expedite, prioritise key customers, adjust safety stock and communicate delivery dates.'),
  ],
  'procurement': [
    Q('How do you choose a supplier and negotiate the contract?', 'Total cost not just price, quality, delivery, financial health and risk; know your alternatives, trade volume and terms for price, and set service levels.'),
  ],
  'inventory management': [
    Q('How do you decide how much stock to keep?', 'Demand variability and lead time drive safety stock and reorder point; use ABC analysis to focus on items that matter and watch ageing stock.'),
  ],
  'negotiation': [
    Q('Tell me about a negotiation you won. What was your approach?', 'Preparation, knowing your walk-away point, understanding the other side’s interests, trading concessions and agreeing next steps in writing.'),
  ],
  'business development': [
    Q('How would you build a pipeline in a market where we have no brand?', 'Define the ideal customer, use targeted outreach and referrals, offer a small pilot, publish proof, and track meetings, pipeline and conversion.'),
  ],
  'lead generation': [
    Q('Which channels would you use to generate qualified leads, and how do you measure quality?', 'Match channels to the buyer; measure cost per qualified lead, lead-to-opportunity rate and revenue, not form fills.'),
  ],
  'account management': [
    Q('A major client threatens to leave. What do you do?', 'Find the real reason fast, meet them, offer a clear fix with dates, involve leadership, and agree how you will measure progress.'),
  ],
  'customer success': [
    Q('How do you spot an at-risk customer early?', 'Falling usage, fewer logins, unanswered emails, support spikes and champion changes; act with a health score and a plan for each segment.'),
  ],
  'customer service': [
    Q('A customer is angry and wrong. How do you handle the call?', 'Let them finish, acknowledge the problem, stay factual, explain what you can do, and follow up. Keep the relationship.'),
  ],
  'recruitment': [
    Q('You have to fill a hard role in 30 days. What is your plan?', 'Agree the must-haves with the hiring manager, source in several channels, screen fast, keep candidates warm, and track funnel conversion each week.'),
  ],
  'payroll': [
    Q('What checks do you run before releasing payroll?', 'Joiners and leavers, attendance and leave, statutory deductions (PF, ESI, TDS), variance to last month and approvals.'),
  ],
  'seo': [
    Q('A site’s organic traffic fell 30% after a release. How do you investigate?', 'Check crawlability and indexing, redirects, canonicals, speed, lost keywords and page templates in Search Console, and compare with algorithm updates.'),
    Q('How do you pick keywords and plan content around them?', 'Intent first, then volume and difficulty, group into topics, map each to a page, and track rankings and conversions.'),
  ],
  'google ads': [
    Q('A campaign spends the budget but conversions are poor. What do you check?', 'Search terms and negatives, match types, ad and landing page match, conversion tracking, bidding strategy and audience or location settings.'),
  ],
  'meta ads': [
    Q('How do you structure and test creatives on Meta ads?', 'Separate audiences and objectives, test one variable at a time, give each ad enough spend, and judge by cost per result, not clicks.'),
  ],
  'content marketing': [
    Q('How do you plan content that brings in customers, not just traffic?', 'Start with the customer’s questions, map content to funnel stages, add clear next steps and measure leads and pipeline.'),
  ],
  'copywriting': [
    Q('Take a feature and write one line selling it. How do you decide what to say?', 'Lead with the customer benefit, use their words, be specific, and test headlines.'),
  ],
  'email marketing': [
    Q('Open rates have fallen. What do you check and change?', 'Deliverability (spam, authentication), list hygiene, subject lines, send time and segmentation. Also note privacy changes that inflate or hide opens.'),
  ],
  'social media marketing': [
    Q('How do you grow a brand account with a small budget?', 'Pick one or two platforms, a clear content series, community replies, collaborations, and track reach, saves and followers who convert.'),
  ],
  'performance marketing': [
    Q('Explain CAC, LTV and ROAS. Which would you optimise?', 'CAC: cost to win a customer. LTV: value over time. ROAS: revenue per ad rupee. Optimise LTV to CAC, since ROAS ignores repeat purchases and margin.'),
  ],
  'marketing automation': [
    Q('Design a welcome flow for new signups. What triggers and measures do you use?', 'Trigger on signup, send a short series by behaviour, stop when they act, and measure activation, not opens.'),
  ],
  'brand management': [
    Q('How do you keep a brand consistent across teams and channels?', 'Clear positioning, voice and visual guidelines, templates, an approval path and regular audits.'),
  ],
  'market research': [
    Q('How would you size the market for a new product?', 'Top-down from industry data and bottom-up from number of customers times price; cross-check the two and state assumptions.'),
  ],
  'project management': [
    Q('A project is two weeks behind. What do you do?', 'Find the cause, re-plan the critical path, cut or phase scope, add resource only where it helps, and tell stakeholders early with a new date.'),
    Q('How do you manage scope creep?', 'Agree scope in writing, route changes through a change request with cost and time, and let the sponsor decide.'),
  ],
  'six sigma': [
    Q('Explain DMAIC and give an example where you used it.', 'Define, Measure, Analyse, Improve, Control. Give the baseline, root cause tool (fishbone, 5 whys), the fix and the improvement in numbers.'),
  ],
  'business analysis': [
    Q('How do you gather requirements from stakeholders who disagree?', 'Separate needs from solutions, tie each requirement to a goal, prioritise with MoSCoW, document, and get sign-off.'),
  ],
  'requirements gathering': [
    Q('How do you write requirements that developers can build and testers can test?', 'Clear user stories with acceptance criteria, examples and edge cases, plus diagrams for flows.'),
  ],
  'cybersecurity': [
    Q('Walk me through how you would respond to a suspected data breach.', 'Contain, preserve evidence, assess scope, eradicate and recover, notify as required, then run a post-incident review.'),
  ],
  'owasp': [
    Q('Explain SQL injection and cross-site scripting and how to prevent each.', 'Injection: parameterised queries and input validation. XSS: output encoding, content security policy and sanitising HTML.'),
  ],
  'penetration testing': [
    Q('What are the phases of a penetration test?', 'Scoping, reconnaissance, scanning, exploitation, post-exploitation, reporting with risk ratings and fix guidance.'),
  ],
  'autocad': [
    Q('How do you manage layers, blocks and drawing standards in AutoCAD?', 'Consistent layer naming, reusable blocks and templates, xrefs for shared files and a checklist before plotting.'),
  ],
  'figma': [
    Q('How do you structure a Figma file for a design system and handoff?', 'Components and variants, styles and variables for colour and type, auto layout, clear naming, and annotated specs.'),
  ],
  'ux design': [
    Q('Walk me through a design you did from problem to launch.', 'The user problem, research, options you explored, tests, the decision and the outcome in numbers.'),
    Q('How do you test a design with five users?', 'Realistic tasks, think-aloud, do not lead, note where they hesitate, fix the top issues and retest.'),
  ],
  'accessibility': [
    Q('How do you check a screen is accessible?', 'Contrast, keyboard use, screen reader labels, focus order, touch targets and not relying on colour alone. Mention WCAG AA.'),
  ],
  'communication': [
    Q('Describe how you explained something complicated to someone who did not understand it.', 'Know the audience, start with the point, use an example or picture, check understanding and follow up in writing.'),
  ],
  'leadership': [
    Q('Tell me about a time you led a team through a hard period.', 'The situation, how you set direction, how you supported people, and what the team achieved.'),
  ],
  'team management': [
    Q('How do you handle an underperforming team member?', 'Clear expectations, specific feedback with examples, find the cause, a short improvement plan with support and a fair outcome.'),
  ],
  'solidworks': [
    Q('How do you build a part in SolidWorks so it is easy to change later?', 'Fully define sketches, capture design intent with relations and key dimensions, name features clearly, use configurations or design tables for variants, and keep the feature tree clean.'),
  ],
  'gd&t': [
    Q('Explain datums and a position tolerance on a drawing.', 'Datums set the reference frame the part is measured from (primary, secondary, tertiary). A position tolerance controls where a feature such as a hole can be: a zone around its true position from those datums.'),
    Q('Why use GD&T instead of plus-minus tolerances?', 'It describes how the part fits and works, gives larger usable tolerance zones (with bonus tolerance at MMC), and leaves less room for the supplier and the inspector to read the drawing differently.'),
  ],
  'sheet metal design': [
    Q('What do you check when designing a sheet metal part?', 'Material and thickness, bend radius and bend relief, minimum flange length, hole distance from bends, the flat pattern, and whether the supplier can make it with their tools.'),
  ],
  'catia': [
    Q('What is the difference between Part Design and Generative Shape Design in CATIA?', 'Part Design builds solid features; Generative Shape Design builds surfaces for complex shapes, which are then turned into solids.'),
  ],
  'fea': [
    Q('How do you check that an FEA result can be trusted?', 'Check mesh quality and convergence, sensible loads and boundary conditions, compare with a hand calculation or test data, and look closely where stress concentrates.'),
  ],
  'dfm': [
    Q('Give an example of a design change that made a part cheaper or easier to make.', 'Name the part, what made it costly (tight tolerance, extra operation, special material), the change you made, and the saving in cost or time.'),
  ],
  'quality control': [
    Q('A batch fails inspection. What do you do?', 'Hold the batch, re-check the sample and the measurement, find the root cause, sort or rework, fix the process, and record the corrective action.'),
  ],
  'root cause analysis': [
    Q('Walk me through a root cause analysis you did.', 'State the problem with data, use 5 whys or a fishbone to list causes, prove the real cause with evidence, fix it, and check that it does not come back.'),
  ],
  'tally': [
    Q('How do you record a purchase with GST in Tally and check it is right?', 'Create the purchase voucher with the right ledger and GST rate, check the tax split (CGST and SGST, or IGST), and match the input credit with GSTR-2B.'),
  ],
  'tds': [
    Q('Explain how TDS works on a vendor payment, and what happens if it is not deducted.', 'Deduct tax at the rate for that section when you pay or credit the vendor, deposit it by the due date, file the quarterly return and issue the certificate. If it is missed, part of the expense can be disallowed and interest applies.'),
  ],
  'ind as': [
    Q('Name an Ind AS standard you have applied and what it changed in the accounts.', 'Pick one you know well, such as Ind AS 115 (revenue) or Ind AS 116 (leases), and explain the treatment and its effect with an example.'),
  ],
  'reconciliation': [
    Q('How do you do a bank reconciliation, and what usually causes differences?', 'Match the bank statement to the books line by line. Differences come from timing (cheques not yet cleared), bank charges, errors and missing entries. Fix the books and explain what remains.'),
  ],
  'mis reporting': [
    Q('What would you put in a monthly MIS report for management?', 'Revenue, costs and margin against budget and last year, the cash position, a few key ratios, and short notes explaining the big differences.'),
  ],
  'financial reporting': [
    Q('How do you prepare monthly financial statements and make sure they are right?', 'Close the sub-ledgers, post accruals and provisions, reconcile key accounts, review differences against budget and last month, and get sign-off.'),
  ],
  'field sales': [
    Q('How many outlets can you cover in a day, and how do you plan your beat?', 'Explain your beat plan: grouping nearby outlets, how often you visit each by size, and how you balance taking orders with adding new outlets.'),
  ],
  'distributor management': [
    Q('A distributor is paying late and shops are running out of stock. What do you do?', 'Talk to the distributor about the reason, agree a payment plan with your manager, protect supply to key outlets, and escalate if it continues.'),
  ],
  'retail sales': [
    Q('How do you turn a customer who is just looking into a buyer?', 'Greet them, ask open questions to understand the need, show two or three right options, handle their doubts, and close with a clear offer.'),
  ],
  'target achievement': [
    Q('Tell me about a month you missed your target. What did you do next?', 'Be honest about the gap and the reason, then the specific changes you made the next month and the result.'),
  ],
  'cold calling': [
    Q('How do you start a cold call so the person does not hang up?', 'Say who you are and why you are calling in one line, mention something relevant to them, ask a simple question, and respect their time.'),
  ],
  'voice process': [
    Q('How do you handle a customer who speaks very fast or has a strong accent?', 'Stay polite, ask them to repeat slowly, confirm key details by repeating them back, and never pretend you understood.'),
  ],
  'chat support': [
    Q('How is chat support different from calls?', 'You handle several chats at once, so you need fast typing, templates you personalise, short clear sentences and no spelling mistakes.'),
  ],
  'ticketing': [
    Q('How do you prioritise tickets in a queue?', 'By impact and urgency first (outages, payments, angry key customers), then by the promised response time, and keep customers updated.'),
  ],
  'lesson planning': [
    Q('Walk me through how you plan a lesson.', 'The learning goal, what students already know, a short hook, explanation with examples, practice, a quick check of understanding, and homework.'),
  ],
  'classroom management': [
    Q('How do you manage a class of 40 students with different levels?', 'Clear routines, group work by level, extra challenges for fast learners, short check-ins for slower ones, and fair, consistent rules.'),
  ],
  'cbse': [
    Q('How do you prepare students for the CBSE board exam pattern?', 'Know the latest sample papers and marking scheme, practise competency and case-based questions, and run timed tests with feedback.'),
  ],
  'student assessment': [
    Q('How do you check if students really understood a topic?', 'Short quizzes, asking them to explain in their own words, exit questions at the end of class, and using common mistakes to plan the next lesson.'),
  ],
  'patient care': [
    Q('Tell me about a patient you cared for that you still remember. What did you do?', 'A real case: their condition, what you did, how you worked with the team and family, and the outcome. Keep patient details anonymous.'),
  ],
  'icu': [
    Q('What do you monitor for a patient on a ventilator, and when do you call the doctor?', 'Vital signs, oxygen saturation, ventilator settings and alarms, airway and tube position, sedation and fluid balance. Escalate any sudden change as your unit protocol says.'),
  ],
  'iv cannulation': [
    Q('How do you insert an IV cannula safely and reduce infection risk?', 'Hand hygiene and an aseptic technique, the right site and size, secure and date it, and check it every shift for signs of phlebitis.'),
  ],
  'medication administration': [
    Q('How do you give high-risk medicines like insulin or heparin safely?', 'Check the prescription and the patient, double-check the dose with a second nurse as your policy says, monitor the patient afterwards, and record it.'),
  ],
  'infection control': [
    Q('How do you stop infections spreading on a ward?', 'Hand hygiene at the right moments, the right protective equipment, isolation when needed, clean equipment, and safe disposal of sharps and waste.'),
  ],
  'emr': [
    Q('What makes good nursing documentation in an electronic record?', 'Accurate, timely and objective entries: care given, changes and escalations with times. Never chart in advance.'),
  ],
  'design systems': [
    Q('How do you keep a design system useful as the product grows?', 'Clear components and tokens, documentation, a contribution and review process with engineers, versioning, and removing parts nobody uses.'),
  ],
  'usability testing': [
    Q('How do you run a usability test, and what do you do with the results?', 'Realistic tasks with about five users, think-aloud, never lead them, note where they struggle, fix the biggest issues and test again.'),
  ],
  'prototyping': [
    Q('When do you use a low-fidelity prototype and when a high-fidelity one?', 'Low-fidelity early, to test flows and ideas quickly. High-fidelity later, to test details and interactions and to hand off to engineers.'),
  ],
  'user stories': [
    Q('Write a user story with acceptance criteria for a simple feature.', 'As a [user], I want [action] so that [benefit], plus testable acceptance criteria (given, when, then) that include edge cases.'),
  ],
  'sourcing': [
    Q('How do you find good candidates for a hard-to-fill role?', 'Boolean searches on job portals and LinkedIn, referrals, communities and past applicants, and a short, clear message about why the role is good for them.'),
  ],
  'naukri': [
    Q('How do you search Naukri for the right candidates quickly?', 'Use keywords and Boolean operators, filter by experience, location, notice period and last active date, and save searches for repeat roles.'),
  ],
  'boolean search': [
    Q('Write a Boolean search for a Java developer in Pune who knows Spring Boot.', 'For example: ("Java developer" OR "Java engineer") AND "Spring Boot" AND Pune NOT intern. Then explain how you would widen or narrow it.'),
  ],
  'onboarding': [
    Q('How do you make sure a new hire has a good first week?', 'Paperwork and laptop ready before day one, a clear schedule, a buddy, meetings with the team and manager, and a check-in at the end of the week.'),
  ],
  'employee engagement': [
    Q('How would you improve engagement in a team with low morale?', 'Find the real reasons through surveys and one-to-ones, fix one or two big issues quickly, recognise good work, and measure again.'),
  ],
};

/* Role families: scenario questions about the job itself. Chosen from the job title and the skill families in the posting. */
export const ROLE_Q = {
  data: [
    Q('A dashboard number looks wrong to the business. How do you find out whether the data or the logic is at fault?', 'Reproduce the number from source, check filters and joins, compare with another system, check recent pipeline changes, then document the definition.'),
    Q('A key number in your report dropped 15% last month. How would you find out why?', 'Confirm the data, then split by product, region, channel and customer type; compare with last year and with price, stock and campaign changes; summarise the likely causes.'),
    Q('You get a request for a report with no clear question. What do you do?', 'Ask what decision it supports, who will use it and how often; agree a small first version and the definitions.'),
    Q('How do you present findings to a manager who has two minutes?', 'Answer first, then the three numbers that matter, the risk and the recommended action. Keep detail in the appendix.'),
  ],
  software: [
    Q('How would you design a URL shortener? Walk through the main parts.', 'Generate unique short codes, store the mapping in a database, cache hot links, redirect with a 301/302, and think about scale, analytics and abuse.'),
    Q('A production service is returning errors for some users. What is your first hour?', 'Check dashboards and recent deploys, roll back if needed, look at logs and traces for the failing path, communicate status and write a post-mortem.'),
    Q('How do you review someone else’s code?', 'Check correctness, tests, readability and security; be specific and kind; separate must-fix from suggestions.'),
    Q('Tell me about a technical decision you made with trade-offs.', 'The options, criteria, what you chose and why, and what you would change now.'),
  ],
  product: [
    Q('How would you improve our product? Pick one area and defend your choice.', 'Name a user and a problem, show evidence, propose a small change, and say how you would measure success.'),
    Q('Two teams want the same engineering resource. How do you decide?', 'Compare impact on goals, cost of delay, dependencies and risk; involve both teams and decide openly.'),
    Q('How do you define success for a new feature?', 'A primary metric tied to the user goal, guardrail metrics, a baseline and a review date.'),
  ],
  marketing: [
    Q('You have a small budget and need leads in 30 days. What is your plan?', 'Pick one or two channels the buyer uses, a simple offer, a landing page, tracking from day one, and review weekly to move money to what works.'),
    Q('How do you know a campaign worked?', 'A goal and baseline set beforehand, a comparison group or time period, and revenue or qualified leads, not just clicks.'),
    Q('Tell me about a campaign that failed. What did you learn?', 'What you expected, what happened, the data you looked at and what you changed after.'),
  ],
  sales: [
    Q('How would you get a new shop to stock our products?', 'Know the shop and its customers, show what sells and the margin they will make, offer a trial order or a scheme, and follow up on time.'),
    Q('How do you plan your day in the field?', 'Plan the route the evening before, visit high-value outlets first, take orders and check stock at each visit, and update your report daily.'),
    Q('Sell me this pen (or our product). How do you start?', 'Ask questions first to find the need, then connect one feature to that need, handle objections and ask for the next step.'),
    Q('You are at 60% of target with two weeks left. What do you do?', 'Review pipeline by stage, focus on deals likely to close, ask for commitments, involve managers or discounts only where sensible.'),
    Q('How do you handle the objection “your price is too high”?', 'Understand what they are comparing, restate the value in their numbers, offer options such as scope or terms, and know your limit.'),
  ],
  finance: [
    Q('Your GST input credit in the books does not match GSTR-2B. What do you do?', 'Reconcile invoice by invoice, follow up with suppliers who have not filed, hold or reverse credit that is not eligible, and fix the process so it does not repeat.'),
    Q('How do you make sure the numbers you report are right?', 'Reconcile to source, review variances, apply checks and sign-offs, keep documentation and fix root causes.'),
    Q('A budget variance of 20% appears. What do you do?', 'Find the drivers (volume, price, timing, one-off), speak to the budget owner, update the forecast and explain the action.'),
    Q('How do you explain financial results to non-finance managers?', 'Start with what changed and why it matters, use a few clear numbers and link to decisions.'),
  ],
  operations: [
    Q('Describe a process you improved. What was the before and after?', 'The problem in numbers, how you found the cause, the change, and the result such as time saved or errors reduced.'),
    Q('A supplier misses a delivery that will stop production. What do you do in the first day?', 'Assess impact, find alternatives or partial shipments, expedite, inform customers early and review the supplier afterwards.'),
    Q('How do you decide what to improve first?', 'Use data to find the biggest waste or delay, estimate effort and impact, and start with quick wins.'),
  ],
  hr: [
    Q('How would you fill 20 open positions in one month?', 'Agree must-have skills with each hiring manager, source on Naukri and LinkedIn with Boolean searches plus referrals, screen fast, and track the funnel weekly (how many sourced, screened, interviewed, offered, joined).'),
    Q('A candidate accepts the offer and then does not join. How do you prevent this?', 'Stay in touch through the notice period, understand their motivations and counter-offer risk early, involve the hiring manager, and keep a backup candidate warm.'),
    Q('How do you handle a sensitive employee complaint?', 'Listen, keep it confidential, follow the policy, investigate fairly, document and close the loop with the people involved.'),
    Q('How do you measure whether hiring is working?', 'Time to fill, quality of hire, offer acceptance rate, source effectiveness, first-year retention and hiring manager satisfaction.'),
    Q('How would you reduce attrition in a team?', 'Find the reasons from exit and stay interviews, fix the top causes (pay, manager, growth) and track the result.'),
  ],
  design: [
    Q('Walk me through one project from your portfolio, from problem to result.', 'The user problem, your research, two or three options you explored, why you chose one, how you tested it, and the result in numbers.'),
    Q('Walk me through your process from a vague brief to a final design.', 'Clarify the problem and users, explore options, test, refine, hand off and measure.'),
    Q('A stakeholder dislikes your design. How do you respond?', 'Ask what outcome they want, explain your reasoning with user evidence, test if needed and stay open to a better answer.'),
  ],
  support: [
    Q('A customer is angry about a late refund. Show me how you would handle the call.', 'Let them finish, apologise for the trouble, confirm the order details, explain clearly what you will do and by when, and follow up as promised.'),
    Q('You do not know the answer to a customer question. What do you do?', 'Never guess. Tell them you will check, put them on hold politely or call back, ask a senior or check the knowledge base, then give a correct answer.'),
    Q('How do you stay calm with a stream of difficult tickets?', 'Triage by impact, use templates for common issues but personalise, take short breaks and escalate when needed.'),
    Q('What makes a support answer good?', 'Fast, correct, clear next steps, in plain words, and a follow-up so the customer knows it is fixed.'),
  ],
  health: [
    Q('A patient suddenly gets worse during your shift. What do you do, step by step?', 'Assess quickly (airway, breathing, circulation), call for help and escalate using your early warning score, stay with the patient, start basic care you are trained for, and record everything with times.'),
    Q('How do you make sure you give the right medicine to the right patient?', 'Check the five rights (patient, drug, dose, route, time) against the chart and the ID band, double-check high-risk drugs with a second nurse, ask if anything is unclear, and record it straight away.'),
    Q('You notice you made a medication error. What do you do?', 'Make the patient safe first, tell the nurse in charge and the doctor at once, report it through the incident system, be open with the patient, and learn from it.'),
    Q('Two patients need you at the same time. How do you decide who comes first?', 'Go to the one whose airway, breathing or circulation is at risk first, ask a colleague to help with the other, and keep both safe and informed.'),
  ],
  teaching: [
    Q('How would you teach a topic most students find hard? Pick one from the syllabus.', 'Start from what they already know, use a real-life example, show one worked problem, let them try in pairs, then check with a short quiz.'),
    Q('A student is falling behind before the board exams. What do you do?', 'Find the exact gaps with a short test, give targeted practice, extra doubt-clearing time, regular feedback, and keep the parents informed.'),
    Q('How do you handle a class that will not settle down?', 'Clear rules from day one, a calm voice, an engaging start, move around the room, praise good behaviour, and deal with repeat issues privately.'),
    Q('How do you keep parents informed about progress?', 'Regular updates with specific examples, early warning when marks drop, and a plan for what the student and parent can do at home.'),
  ],
  engineering: [
    Q('A part you designed fails in testing. What do you do?', 'Contain the issue, find the root cause (drawing, tolerance, material, process), test the fix, update the drawing and record what changed.'),
    Q('How do you make sure a design can be made at the right cost?', 'Talk to manufacturing and suppliers early, use standard parts and materials, avoid tight tolerances you do not need, and review cost at each design stage.'),
    Q('Walk me through how you prepare a drawing for a supplier.', 'Correct views and sections, clear dimensions and GD&T on the functional features, material and finish notes, revision control, and a check before release.'),
  ],
  ba: [
    Q('How do you turn a vague request from a business team into clear requirements?', 'Ask what problem they want solved and how they measure it, write user stories with acceptance criteria, confirm with examples, and get sign-off.'),
    Q('Two stakeholders want opposite things. How do you handle it?', 'Bring them together with the data, link each ask to the business goal, show the trade-offs, and let the owner decide.'),
  ],
  admin: [
    Q('You have ten urgent tasks from three managers. How do you decide what to do first?', 'Check deadlines and impact, ask when it is unclear, tell people when their task will be done, and keep a simple list.'),
    Q('How do you make sure your data entry has no mistakes?', 'Work carefully, use checks such as totals and spot checks, never guess unclear data, and correct errors at the source.'),
  ],
  retail: [
    Q('A customer wants to return a product outside the return policy. What do you do?', 'Listen, explain the policy politely, offer what you can (exchange, repair, manager approval), and keep the customer calm and respected.'),
    Q('How do you increase sales on a slow day in the store?', 'Greet every customer, ask what they need, suggest add-ons that genuinely help, and keep displays and stock ready.'),
  ],
  logistics: [
    Q('A delivery will be late. What do you do?', 'Tell the customer early with a new time, find the fastest fix, inform your manager, and note the reason to avoid it next time.'),
    Q('How do you keep stock records accurate?', 'Record every movement at once, do regular cycle counts, investigate differences, and fix the cause, not just the number.'),
  ],
  hospitality: [
    Q('A guest complains about their food or room. How do you handle it?', 'Apologise, listen, fix it fast or offer an alternative, inform your manager, and check back with the guest.'),
    Q('How do you stay calm and fast during a rush?', 'Prepare before the rush, prioritise, communicate with the team, and keep standards even when busy.'),
  ],
  ml: [
    Q('You have a model with good offline metrics but poor results in production. Why?', 'Data drift, train-test leakage, differences in features at serving time, wrong metric or feedback loops. Check monitoring and compare distributions.'),
    Q('How do you take a model from notebook to production?', 'Clean code and tests, versioned data and models, a repeatable pipeline, deployment with monitoring, rollback and retraining plan.'),
  ],
};

/* Words in the job title that select a role family. */
export const ROLE_KEYS = [
  ['health', /\b(nurse|nursing|doctor|physician|pharmacist|medical officer|clinical|physiotherapist|lab technician|caregiver|ward|midwife|paramedic|dentist|radiographer)\b/i],
  ['teaching', /\b(teacher|tutor|faculty|lecturer|professor|pgt|tgt|prt|educator|instructor|academic coordinator)\b/i],
  ['admin', /\b(data entry|back office|office (assistant|administrator|executive)|admin(istrative)? (assistant|executive|officer)|receptionist|front office|executive assistant|secretary|mis executive)\b/i],
  ['ba', /\b(business analyst|systems analyst|functional consultant|business systems analyst)\b/i],
  ['ml', /\b(machine learning|ml engineer|data scientist|ai engineer|nlp|deep learning)\b/i],
  ['engineering', /\b(mechanical|civil|electrical|electronics|production engineer|manufacturing|design engineer|quality engineer|site engineer|maintenance engineer|plant|cad engineer|process engineer|instrumentation)\b/i],
  ['product', /\b(product (manager|owner|lead|head)|head of product|\bpm\b)\b/i],
  ['data', /\b(data|analyst|analytics|bi|business intelligence|reporting|insights?)\b/i],
  ['software', /\b(software|developer|engineer|programmer|frontend|front-end|backend|back-end|full[- ]?stack|sde|devops|sre|qa|tester|test|android|ios|mobile|cloud)\b/i],
  ['support', /\b(support|customer (service|success|care)|helpdesk|service desk|voice process|non[- ]voice|call cent(er|re)|bpo|telecaller|tele[- ]caller)\b/i],
  ['marketing', /\b(marketing|seo|content|growth|brand|social media|digital|copywriter|performance marketer)\b/i],
  ['retail', /\b(store|retail|cashier|shop|showroom|counter|merchandiser)\b/i],
  ['sales', /\b(sales|business development|bdm?|bde|account (executive|manager)|relationship manager|territory|area manager)\b/i],
  ['finance', /\b(finance|financial|account(ant|ing|s)?|audit(or)?|tax|treasury|fp&a|controller|chartered accountant)\b/i],
  ['logistics', /\b(delivery|driver|warehouse|logistics|dispatch|courier|fleet|supply chain|inventory)\b/i],
  ['hospitality', /\b(hotel|chef|cook|kitchen|waiter|steward|housekeeping|front desk|restaurant|barista|f&b|hospitality)\b/i],
  ['operations', /\b(operations?|procurement|purchase|planning|project manager|program manager|coordinator)\b/i],
  ['hr', /\b(hr|human resources?|recruit(er|ment)?|talent|people (partner|operations)|payroll)\b/i],
  ['design', /\b(design(er)?|ux|ui|creative|illustrator|animator|graphic)\b/i],
];

/* Plain names for each kind of work, and who usually runs the second interview. */
export const ROLE_LABEL = {
  health: 'healthcare', teaching: 'teaching', admin: 'office administration', ba: 'business analysis', ml: 'machine learning', engineering: 'engineering design',
  product: 'product management', data: 'data and analytics', software: 'software engineering', support: 'customer support', marketing: 'marketing',
  retail: 'retail', sales: 'sales', finance: 'finance and accounts', logistics: 'logistics', hospitality: 'hospitality', operations: 'operations', hr: 'HR and recruitment', design: 'design',
};
export const MANAGER_TITLE = {
  health: 'the ward manager or nurse in charge', teaching: 'the principal or head of department', admin: 'the office manager', ba: 'the product or delivery lead',
  ml: 'the head of data science', engineering: 'the engineering or design manager', product: 'the head of product', data: 'the analytics manager',
  software: 'the engineering manager or tech lead', support: 'the team leader or operations manager', marketing: 'the head of marketing', retail: 'the store manager',
  sales: 'the area sales manager', finance: 'the finance controller or CFO', logistics: 'the operations manager', hospitality: 'the outlet or department manager',
  operations: 'the operations head', hr: 'the talent acquisition lead or HR head', design: 'the design lead',
};
/* Kinds of work close enough that moving between them is not a career change. */
export const ADJACENT = {
  data: ['ml', 'ba', 'software'], ml: ['data', 'software'], software: ['ml', 'data'], ba: ['data', 'product'], product: ['ba'], sales: ['retail', 'support', 'marketing'],
  retail: ['sales', 'support'], support: ['sales', 'retail', 'admin'], operations: ['logistics', 'admin'], logistics: ['operations'], admin: ['operations', 'support', 'hr'], hr: ['admin'],
  marketing: ['sales'], design: [], engineering: [], finance: [], health: [], teaching: [], hospitality: ['retail'],
};

/* Skill families (from skills.js) that hint at a role family when the title is vague. */
export const FAMILY_TO_ROLE = {
  language: 'software', frontend: 'software', backend: 'software', cloud: 'software', mobile: 'software', quality: 'software',
  data: 'data', data_store: 'data', ml: 'ml', product: 'product', marketing: 'marketing', design_eng: 'engineering', health: 'health', teaching: 'teaching',
};

/* The kind of work a job title describes. The main title decides; words in brackets only help when the main title says nothing.
   When several kinds match, the word nearest the end wins, because English job titles end with the job itself
   ("Software Engineer, Clinical Systems" is software; "Healthcare Recruitment Consultant" is recruitment). */
export function familyOfTitle(title) {
  const t = String(title || '');
  const main = t.replace(/\([^)]*\)/g, ' ').split(/\s+[-–—|]\s+|,\s*/)[0];
  const pick = (s) => {
    let best = null; let at = -1;
    for (const [k, re] of ROLE_KEYS) {
      const g = new RegExp(re.source, 'gi'); let m; let last = -1;
      while ((m = g.exec(s))) { last = m.index + m[0].length; if (!m[0].length) g.lastIndex++; }
      if (last > at) { at = last; best = k; }
    }
    return best;
  };
  return pick(main) || pick(t);
}

/* Skills that only belong to one kind of work. In other jobs these words describe the company, its customers or another team. */
const DOMAIN = {
  health: ['health'], teaching: ['teaching'],
  hr: ['recruitment', 'payroll', 'hris', 'employee engagement', 'onboarding', 'sourcing', 'naukri', 'linkedin recruiter', 'boolean search'],
  finance: ['accounting', 'tally', 'gst', 'taxation', 'audit', 'ifrs', 'gaap', 'tds', 'ind as', 'income tax', 'reconciliation', 'financial reporting', 'budgeting', 'financial modeling'],
  logistics: ['supply chain', 'procurement', 'logistics', 'tms', 'inventory management'],
};
const DOMAIN_JOBS = {
  health: ['health'], teaching: ['teaching'], hr: ['hr', 'admin'],
  finance: ['finance', 'ba', 'operations', 'admin', 'logistics', 'retail'],
  logistics: ['logistics', 'operations', 'retail', 'hospitality', 'engineering'],
};
export function skillFitsJob(name, family, jobFam) {
  if (!jobFam) return true;
  const n = String(name || '').toLowerCase();
  for (const [d, list] of Object.entries(DOMAIN)) {
    const hit = (d === 'health' || d === 'teaching') ? family === d : list.includes(n);
    if (hit) return DOMAIN_JOBS[d].includes(jobFam);
  }
  return true;
}
