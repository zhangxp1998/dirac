# Evals

## Tasks

### Task 1: extensionswb_service (vscode)
simple refactoring task: src/vs/workbench/contrib/extensions/browser/extensionsWorkbenchService.ts is the central coordinator for all extension-related UI operations it has gotten too large, we want to refactor it without breaking any dependencies. the goal is to divide it in smaller more manageable modules you must produce clean code with no linter errors. Your changes should be limited to the aforementioned file and creating any new file as needed

create two new files, extension.ts and extensions.ts and move the relevant functionality to them


### Task 2: sendRequest (vscode)
chat service's sendRequest currently takes multiple parameters. refactor it to take a single param object. make sure to update all call sites

### Task 3: IOverlayWidget (vscode)
Find the IOverlayWidget interface in the codebase. Add a new mandatory method to it: getName(): string. You can simply return a human-readable version of the class name or a stringified version of what getId() returns. Make sure to all implementations are updated and no missing property errors

### Task 4: addLogging (vscode)
Find every exact definition of runCommand across the entire repository and add simple console.log statements to track their entry and exit. Ensure the exit logging is guaranteed to fire regardless of early returns or errors, without modifying any existing imports or method signatures.

### Task 5: DynamicCache (transformers)
Find the DynamicCache class in src/transformers/cache_utils.py and add a new boolean property is_stale that defaults to False. Then, locate the forward pass of the Attention modules for the following models in the src/transformers/models/ directory: llama4, mistral4, qwen3, gemma4, deepseek_v3, cohere2, olmo3, ministral3.

Update their attention logic: if past_key_value is an instance of DynamicCache and past_key_value.is_stale is True, bypass the internal cache update block and raise a UserWarning with a descriptive message. Do not break any existing tensor slicing or formatting. Ensure ruff check passes after your edits.


### Task 6: stoppingcriteria (transformers)
Users have requested the ability to stop text generation early if the model becomes highly uncertain. Find the GenerationConfig class and add two new parameters: entropy_threshold: float | None = None and entropy_patience: int = 1. Next, locate the file containing the StoppingCriteria base class. In that same file, implement a new EntropyStoppingCriteria class that inherits from it. It should compute the Shannon entropy of the scores (logits) at each step. If the entropy exceeds entropy_threshold for entropy_patience consecutive steps for a given sequence in the batch, it should flag that sequence as done. Finally, find the _get_stopping_criteria method in the generation framework. If the configuration has an entropy_threshold set, instantiate and append your new criteria to the StoppingCriteriaList. run a ruff check on modified files and make sure they pass. do not run any other checkes

### Task 7: latency (transformers)
We want to introduce built-in latency telemetry across the entire Hugging Face Pipelines architecture for debugging purposes. Update the base class to accept a new keyword argument record_latency: bool = False, and save it as an instance attribute. You must update every pipeline class in src/transformers/pipelines/  that implements _forward method. Modify each method so that if self._record_latency is True, it records the exact time taken by the underlying model inference call using time.perf_counter(). Log this duration in milliseconds using the standard module-level logger.info with the exact message format: '[<PipelineClassName>] Inference latency: <latency> ms' (where <PipelineClassName> is dynamically or statically replaced with the name of that specific class).  Do not modify the structure of the returned model outputs. Do not change the general layout or relacote functions

Verification: Ensure ruff check passes across the entire pipelines directory. Do not run any other checks

for ruff commands, use the local .venv

### Task 8: datadict (django)
We want to rename the value_from_datadict method to extract_value_from_request in django.forms.Widget and all its subclasses, and update all calls to this method across the codebase. only update the code, no docs or txt files. make sure to run ruff using .venv locally (only run on the files you modify). do NOT run any tests

## Test Method
1. Before every test, git reset --hard && git clean -fd
2. Close all open vscode tabs (for vscode based agents) before every test 
3. Run only 1 agent at a time, nothing touches the repo besides that 1 agent
4. For each agent, start in plan mode equivalent if available, accept the plan it suggests, allow first switch to text mode
5. No manual guiding or nudging to any agent
6. All agents had reasoning set to ‘high’ 
7. The agents marked as failure were given at least 3 tries
