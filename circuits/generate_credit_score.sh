#!/bin/bash
# generate_credit_score.sh - Generate real verification key for credit_score circuit

set -e

CWD_DIR="$(cd "$(dirname "$0")" && pwd)"
export PATH="${CWD_DIR}/.circom/bin:${CWD_DIR}/../node_modules/.bin:$PATH"

CIRCUIT="credit_score"
BUILD_DIR="build/${CIRCUIT}"
PTAU="build/powersOfTau28_hez_final_12.ptau"

echo "🔧 Setting up ZK circuit: ${CIRCUIT}"

mkdir -p "${BUILD_DIR}"

echo "📝 Compiling circuit..."
circom "${CIRCUIT}.circom" --r1cs --wasm --sym -o "${BUILD_DIR}"

if [ ! -f "${PTAU}" ]; then
    echo "⬇️  Downloading powers of tau..."
    if ! wget -O "${PTAU}" https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_12.ptau; then
        rm -f "${PTAU}"
    fi
fi

if [ ! -s "${PTAU}" ]; then
    echo "🧪 Generating powers of tau locally (offline)..."
    snarkjs powersoftau new bn128 12 "${BUILD_DIR}/pot12_0000.ptau" -v
    snarkjs powersoftau contribute "${BUILD_DIR}/pot12_0000.ptau" "${BUILD_DIR}/pot12_0001.ptau" --name="arbshield" -v -e="$(date +%s)"
    snarkjs powersoftau prepare phase2 "${BUILD_DIR}/pot12_0001.ptau" "${PTAU}"
fi

echo "🔑 Generating proving key..."
snarkjs groth16 setup "${BUILD_DIR}/${CIRCUIT}.r1cs" "${PTAU}" "${BUILD_DIR}/${CIRCUIT}_0000.zkey"

echo "📤 Exporting verification key..."
snarkjs zkey export verificationkey "${BUILD_DIR}/${CIRCUIT}_0000.zkey" "${BUILD_DIR}/verification_key.json"

echo "🧾 Exporting Solidity verifier..."
snarkjs zkey export solidityverifier "${BUILD_DIR}/${CIRCUIT}_0000.zkey" ../contracts/src/CreditScoreVerifier.sol

echo "🧪 Generating test proof (creditScore=750, threshold=700)..."
echo '{"creditScore": "750", "threshold": "700"}' > "${BUILD_DIR}/input.json"

node "${BUILD_DIR}/${CIRCUIT}_js/generate_witness.js" \
  "${BUILD_DIR}/${CIRCUIT}_js/${CIRCUIT}.wasm" \
  "${BUILD_DIR}/input.json" \
  "${BUILD_DIR}/witness.wtns"

snarkjs groth16 prove \
  "${BUILD_DIR}/${CIRCUIT}_0000.zkey" \
  "${BUILD_DIR}/witness.wtns" \
  "${BUILD_DIR}/proof.json" \
  "${BUILD_DIR}/public.json"

echo "✅ Verifying proof with snarkjs..."
snarkjs groth16 verify "${BUILD_DIR}/verification_key.json" "${BUILD_DIR}/public.json" "${BUILD_DIR}/proof.json"

echo "📦 Copying artifacts to public/zk/credit_score..."
mkdir -p ../public/zk/credit_score
cp "${BUILD_DIR}/${CIRCUIT}_js/${CIRCUIT}.wasm" ../public/zk/credit_score/credit_score.wasm
cp "${BUILD_DIR}/${CIRCUIT}_0000.zkey" ../public/zk/credit_score/credit_score.zkey
cp "${BUILD_DIR}/verification_key.json" ../public/zk/credit_score/verification_key.json

echo ""
echo "✅ Setup complete!"
echo ""
echo "📁 Generated files:"
echo "  - ${BUILD_DIR}/verification_key.json"
echo "  - ${BUILD_DIR}/proof.json"
echo "  - ${BUILD_DIR}/public.json"
echo "  - ${BUILD_DIR}/${CIRCUIT}_0000.zkey"
echo "  - ../contracts/src/CreditScoreVerifier.sol"
echo "  - ../public/zk/credit_score/*"
