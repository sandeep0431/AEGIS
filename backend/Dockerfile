# AWS Lambda Python 3.12 container image base
# Linux/amd64 target — do NOT use Windows-specific wheels
FROM public.ecr.aws/lambda/python:3.12

# Copy and install Python dependencies first (layer-cache friendly)
COPY requirements.txt ${LAMBDA_TASK_ROOT}/
RUN pip install --no-cache-dir -r ${LAMBDA_TASK_ROOT}/requirements.txt

# Copy application source into /var/task/src/
# src/config.py resolves MODEL_DIR as Path(__file__).parent.parent / "model_artifacts"
# → /var/task/src/../model_artifacts → /var/task/model_artifacts  ✓
COPY src/ ${LAMBDA_TASK_ROOT}/src/

# Copy pre-trained ML model artifacts
COPY model_artifacts/ ${LAMBDA_TASK_ROOT}/model_artifacts/

# Lambda entry point: src.handler.lambda_handler
CMD ["src.handler.lambda_handler"]
