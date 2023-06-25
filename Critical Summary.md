# Instructions

Please submit a critical summary, contribution, or evaluation of 200-300 words for each paper. In your summary, provide a concise overview of the key points discussed in each paper. Explain the main findings, methodologies used, and any significant insights or recommendations provided by the authors.

For those students who may not be familiar with writing critical summaries, here are some guidelines to help you:

- Start by reading each paper carefully. Identify the main objectives, research questions, or problems addressed by the authors.
- Summarize the key ideas and arguments presented in each paper. Focus on the main findings or outcomes of the research.
- Provide a brief explanation of how each paper relates to your own project. Highlight any similarities or differences between the authors' work and your own goals or objectives.
- Consider the strengths and weaknesses of each paper. Are there any limitations in the methodology or scope of the research? Are there areas that could have been explored further?
- Reflect on the significance of each paper to the broader field of study. Does it contribute new insights or offer valuable recommendations? Discuss the potential impact or implications of the findings.
- Use clear and concise language in your summaries. Avoid excessive technical jargon and ensure that your writing is accessible to readers who may not have a deep background in the subject matter.

Isaac - Odd #s
Connor - Even #s

# Reading List Critical Summary (Group 1)

## [PBKDF2 NIST Publication](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf)

Main objectives/Research questions/Problems addressed:
- Low entropy and (sometimes) poor randomness of passwords, they are not suitable to be directly used as cryptographic keys
- Article specifies a family of password-based key derivation functions (PBKDFs) to derive better cryptographic keys from passwords

Key Ideas:
- To obtain a high-entropy master key for encryption purposes, combine a user password with a salt through a KDF
- The salt must be at least 128 bits
- Instead of HMAC-ing password+salt once, perform many iterations of HMAC using the result of the previous iteration

Strengths:
- With sufficient iteration counts, slow to perform. This slows down attackers and keeps things secure. And since security is based on a fixed number of iterations...
- Easily scales with newer, more powerful hardware
- Easily adjustable to work on platforms of varying capability

Weaknesses:
- Overall security of the specified algorithm depends on sufficiently random inputs

## [Keccack Implementation Overview](https://keccak.team/files/Keccak-implementation-3.2.pdf)

Main objectives/Research questions/Problems addressed:
- Provide an overview of the `Keccak` family of algorithms, which underly cryptographic algorithms such as SHA-3.

Key Ideas:
- The key ideas of the paper are primarily the optimization methods depending on software and hardware conditionss

Strengths:
- Built on the sponge design, allowing any arbitrary-length input to be digested to a fixed- and chooseable output length
- Fast to compute, on par with SHA-256
- Constant memory usage, with no feed-forward loop
- A variety of implementation techniques are discussed, allowing optimization on many common instruction sets

Weaknesses:

## [Time-based OTP authentication via secure tunnel (TOAST): A mobile TOTP scheme using TLS seed exchange and encrypted offline keystore](https://ieeexplore.ieee.org/abstract/document/6920371)

Main objectives/Research questions/Problems addressed:
- Build a cryptographically secure auth system that complements the existing authentication scheme (username + password + 2FA)

Key Ideas:
- TOTP works great but can be improved using at-rest secret encryption

Strengths:
- If an attacker obtains the on-disk keystore, the contents remain secure as they can only be brute forced

Weaknesses:
- The article does not outline any server-side at-rest encryption for the TOTP secret, so unless extra measures are taken (such as similar at-rest encryption as the client) the server-side keystore remains a point of failure

## [Curve25519: New Diffie-Hellmen Speed Records](https://link.springer.com/chapter/10.1007/11745853_14)

Main objectives/Research questions/Problems addressed:
- Introduce and analyze Curve25519 (C25519), a new high-security elliptic-curve-Diffie-Hellman function

Key Ideas:
- Using unique private keys and publicly shared public keys, as well as a common algorithm (C25519) and string (9) two users can securely exchange a shared secret for cryptographic calculations (such as message encryption for transmission)
- C25519 is just as secure as previous ECDH implementations but faster (based on the author's software on Pentium III 400MHz)

Strengths:
- Fast
- Secure
- Any known attack on the function is less feasible than simply brute-forcing the exchanged secret key

Weaknesses:
- ECDH (and even just DH) in general is vulnerable to man in the middle attacks. This problem is solved using Certificate Authorities to create digital signatures.

## [Persistence of Passwords in Bitwarden’s Browser Extension: Unnecessary Retention and Solutions](https://passcert-project.github.io/publication/2022/rafael-prates-thesis/2022_IST_MSc_Thesis_RafaelPrates.pdf)

Main objectives/Research questions/Problems addressed:
- Does the memory model of password managers, such as BitWarden (targetted in this article) pose memory content vulnerabilities caused by data living longer than it should?
- If memory vulnerabilities exist, what can be done about them?

Key Ideas:
- The contents of application memory are potentially accessible to attackers via an assortment of attacks, including cold-boot attacks and memory dumping attacks such as HeartBleed 
- Since the security of a password manager generally comes from a strong master password, if said password is kept in memory longer than it needs to it poses a security risk
- In general, string data (immutable) is dangerous. Instead, using an array buffer (or simply an "array") where possible allows similar behaviour while maintaining mutability. Since the data is mutable, it can thus be zeroed out when it is no longer needed, removing the data from memory explicitly rather than awaiting garbage collection and data overwrite

Strengths:
- Very thorough testing, including searching for a partial master password mid-entry
- Multiple solid attempts to reduce master passwords left in memory
