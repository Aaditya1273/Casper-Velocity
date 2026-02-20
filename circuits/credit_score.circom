pragma circom 2.0.0;

// Num2Bits and LessThan adapted from circomlib (MIT)
template Num2Bits(n) {
    signal input in;
    signal output out[n];

    var acc = 0;
    var pow2 = 1;

    for (var i = 0; i < n; i++) {
        out[i] <-- (in >> i) & 1;
        out[i] * (out[i] - 1) === 0;
        acc += out[i] * pow2;
        pow2 = pow2 * 2;
    }

    acc === in;
}

template LessThan(n) {
    signal input in[2];
    signal output out;

    // Range constrain inputs to n bits
    component aBits = Num2Bits(n);
    component bBits = Num2Bits(n);
    aBits.in <== in[0];
    bBits.in <== in[1];

    // Compute a - b + 2^n and inspect the (n)th bit
    var twoPowN = 1;
    for (var i = 0; i < n; i++) {
        twoPowN = twoPowN * 2;
    }
    component diffBits = Num2Bits(n + 1);
    diffBits.in <== in[0] + twoPowN - in[1];

    // out = 1 if a < b
    out <== 1 - diffBits.out[n];
}

// Prove creditScore >= threshold without revealing creditScore
template CreditScoreProof(n) {
    signal input creditScore;
    signal input threshold;
    signal output isAbove;

    component lt = LessThan(n);
    lt.in[0] <== creditScore;
    lt.in[1] <== threshold;

    // isAbove = 1 if creditScore >= threshold
    isAbove <== 1 - lt.out;
    // Enforce threshold satisfied
    isAbove === 1;
}

// Public inputs: threshold only
component main { public [threshold] } = CreditScoreProof(32);
