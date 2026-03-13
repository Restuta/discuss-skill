# Research

Multi-agent debate is not just a vibe. There is real research showing structured disagreement between LLMs improves accuracy, factuality, and reasoning quality.

This project's claim is modest:

1. Multiple reasoning paths can help
2. Structured disagreement can help
3. You still need hard stop rules, clear roles, and concise synthesis

## Primary Sources

### Multi-agent debate improves factuality and reasoning

Du et al. (2023/ICML 2024) show that multiple agents debating improved ChatGPT-3.5 accuracy on math (GSM8K) from 77% to 85%, on MMLU from 64% to 71%, and on biographical factuality from 66% to 74%. Cross-model debate (Bard + ChatGPT) solved 17/20 problems vs. 14 and 11 individually.

Source: [Improving Factuality and Reasoning in Language Models through Multiagent Debate](https://arxiv.org/abs/2305.14325)

### Debate with persuasive LLMs leads to more truthful answers

Khan et al. (ICML 2024, Best Paper) show that when two LLM debaters argue opposing sides and a non-expert judge picks the winner, accuracy jumped from 48% to 76% (non-expert models) and from 60% to 88% (humans).

Source: [Debating with More Persuasive LLMs Leads to More Truthful Answers](https://arxiv.org/abs/2402.06782)

### Round-table conference improves reasoning via consensus

Chen et al. (ACL 2024) show that round-table discussion with confidence-weighted voting surpassed GPT-4 on three benchmarks, up to +11.4% improvement.

Source: [ReConcile: Round-Table Conference Improves Reasoning via Consensus among Diverse LLMs](https://arxiv.org/abs/2309.13007)

### Divergent thinking through multi-agent debate

Liang et al. (EMNLP 2024) found that LLMs suffer from "Degeneration-of-Thought" in self-reflection —multi-agent debate overcomes it. GPT-3.5 with debate surpassed GPT-4 on commonsense translation.

Source: [Encouraging Divergent Thinking in Large Language Models through Multi-Agent Debate](https://arxiv.org/abs/2305.19118)

### Self-consistency improves chain-of-thought reasoning

Wang et al. show that sampling multiple reasoning paths and choosing the most consistent answer can improve reasoning performance.

Source: [Self-Consistency Improves Chain of Thought Reasoning in Language Models](https://arxiv.org/abs/2203.11171)

### Adaptive debate reduces cost without sacrificing quality

Eo et al. show that debate does not need to happen on every problem, and adaptive strategies can retain quality while reducing cost.

Source: [Debate Only When Necessary: Adaptive Multiagent Collaboration for Efficient LLM Reasoning](https://arxiv.org/abs/2504.05047)

## Caveat

A [2025 ICLR analysis](https://d2jud02ci9yv69.cloudfront.net/2025-04-28-mad-159/blog/mad/) noted that multi-agent debate doesn't consistently outperform simpler methods like chain-of-thought on all benchmarks. The benefits are most pronounced on tasks requiring diverse perspectives, factual verification, and structured reasoning —which is exactly what this tool targets.

## Practical Takeaway

What matters most for `discuss-skill` is not "more agents."

What matters is:

1. One shared source of truth
2. Disciplined turn structure
3. Explicit contention points
4. Concise consensus output
5. Clear stop conditions
