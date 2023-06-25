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

[The article](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf) addresses the problem of low entropy and poor randomness of passwords, highlighting their unsuitability for direct use as cryptographic keys. It introduces a family of password-based key derivation functions (PBKDFs) as a solution to derive better cryptographic keys from passwords. This article is relevant to our project as we are concerned with securely encrypting user data, using keys only the user knows. This means that we need a way to derive a secure encryption key from a much less secure (but memorable) password. The techniques outlined in this paper are widely used by other existing password managers.

The main idea presented in the article is to combine a user password with a salt through a key derivation function (KDF) to obtain a master key for encryption purposes. It emphasizes the importance of salt length, and recommends a minimum length of 128 bits. Additionally, instead of performing a single HMAC (Hash-based Message Authentication Code) operation on the password and salt, the authors suggest performing many iterations of HMAC, reusing the results of previous iterations.

One of the strengths of this approach is that by using a sufficient number of iteration counts, the process becomes slow, which adds an extra layer of security by slowing down potential attackers. This is desireable as it makes brute forcing the key original key infeasible. Since the security is derived from the number of iterations, this method easily scales with newer and more powerful hardware, ensuring it remains effective over time.

However, a notable weakness of the specified algorithm is that its overall security relies heavily on the use of sufficiently random inputs. If the inputs are not truly random, it could compromise the security of the derived cryptographic keys. One other weakness is that as hardware becomes more powerful, the generated key needs to become longer to prevent it from being brute forced.

In conclusion, the article addresses the limitations of using passwords as cryptographic keys and proposes a family of PBKDFs as a solution. While the method has strengths in terms of its scalability and ability to slow down attackers, its security is potentially dependent on the randomness of the inputs, which must be carefully considered during implementation.

## [Keccack Implementation Overview](https://keccak.team/files/Keccak-implementation-3.2.pdf)

[The article](https://keccak.team/files/Keccak-implementation-3.2.pdf) provides an overview of the Keccak family of algorithms, which serve as the foundation for cryptographic algorithms like SHA-3. The key ideas presented in the paper revolve around optimization methods based on software and hardware conditions. Some examples include bit interleaving, leveraging Single Instruction Multiple Data (SIMD) instructions on capable hardware, and even utilizing graphics hardware for batch computation. Our project will use secure hashing extensively, so an understanding of the workings of such algorithms is valuable.

One of the strengths of these algorithms is their sponge-like design, allowing the usage ("digestion") of inputs of any length into a fixed and configurable output length. Additionally, the Keccak algorithms are capable of fast computation speeds comparable to SHA-256. They also support constant memory usage without a feed-forward loop.

In conclusion, the article provides insights into optimizing Keccak algorithms. By focusing on optimization techniques based on software and hardware conditions, the paper provides valuable insights into accelerating these algorithms. Overall, the article offers a comprehensive exploration of the Keccak algorithm family.

## [Time-based OTP authentication via secure tunnel (TOAST): A mobile TOTP scheme using TLS seed exchange and encrypted offline keystore](https://ieeexplore.ieee.org/abstract/document/6920371)

[The article](https://ieeexplore.ieee.org/abstract/document/6920371) aims to develop a cryptographically secure authentication system as an enhancement to the current authentication scheme, which consists of a username, password, and two-factor authentication (2FA). The main idea is to improve the Time-based One-Time Password (TOTP) method by incorporating at-rest secret encryption. A TOTP "secret" is a shared value that both the client and server know, and use to generate a random number. "Time-based" refers to the code changing periodically with time.

One strength of the proposed system is that even if an attacker manages to obtain the on-disk keystore, the contents remain secure since they can only be brute-forced. This ensures the confidentiality of the stored secrets.

One minor weakness in the article is that it fails to discuss server-side security for the TOTP secret. Without additional measures, such as implementing similar at-rest encryption on the server side as on the client side, the server-side keystore remains vulnerable and can be exploited as a point of failure.

Our project will take the idea of at-rest encryption and utilize it to keep user data, such as passwords and other secret information, completely out of our hands. We would like to store as little data as possible in the cloud, particularly pieces of information which would allow user data to be decrypted. This has already been demonstrated in practice by other password managers such as 1Password.

Overall, the article presents an interesting approach to enhance the security of authentication systems by introducing at-rest secret encryption. However, the omission of server-side at-rest encryption or other secret security methods poses a security risk that we will aim to prevent.

## [Curve25519: New Diffie-Hellmen Speed Records](https://link.springer.com/chapter/10.1007/11745853_14)

[The article](https://link.springer.com/chapter/10.1007/11745853_14) introduces Curve25519 ("the algorithm"), a new high-security elliptic-curve-Diffie-Hellman (ECDH) function. The key idea is that two users can securely exchange a shared secret for cryptographic calculations, such as message encryption, by utilizing unique private keys and publicly shared public keys. This is accomplished through the Curve25519 algorithm. 

The author's software demonstrates that C25519 is not only as secure as previous ECDH implementations but also faster. The strengths of C25519 include its speed and security, with any known attack on the function being less feasible than brute-forcing the exchanged secret key. 

However, a weakness identified is that ECDH, and even Diffie-Hellman exchanges in general, are susceptible to man-in-the-middle attacks. To address this vulnerability in practice, certificates signed by trusted Certificate Authorities are used to validate that either party is who they claim to be.

Our hope is that the algorithm might help us design a secure data exchange system between our servers and client apps.

## [Persistence of Passwords in Bitwarden’s Browser Extension: Unnecessary Retention and Solutions](https://passcert-project.github.io/publication/2022/rafael-prates-thesis/2022_IST_MSc_Thesis_RafaelPrates.pdf)

[The article](https://passcert-project.github.io/publication/2022/rafael-prates-thesis/2022_IST_MSc_Thesis_RafaelPrates.pdf) focuses on the memory model of password managers, specifically targeting BitWarden, and investigates the potential vulnerabilities caused by data living longer than necessary in memory. The main research questions addressed are whether memory content vulnerabilities exist in password managers and what measures can be taken to mitigate them.

The article highlights that attackers can potentially access the contents of application memory through various attacks, such as cold-boot attacks and memory dumping attacks like HeartBleed. It emphasizes that the security of a password manager primarily relies on a strong master password, and if this password remains in memory longer than required, it increases the liklihood that it appears in a process memory dump, thus increasing security risk.

One key idea proposed is to avoid storing sensitive data as immutable strings. In most languages, this means that the data can live in memory for a very long time, as it is only cleaned up at the whims of garbage collection. Instead, the article suggests using an array buffer (or simply an "array") whenever possible, as it allows the same data to be represented while maintaining mutability. Sensitive data that is stored mutably can be zeroed out (or otherwise overwritten) once no longer needed. This removes the dependency on garbage collection cleaning up the unused values.

A notable strength of the article is its thorough testing methodology, which includes searching for a partial master password during entry. Additionally, the article presents a few application-level modifications to the browser extension to attempt to reduce long-lived data.

Overall, the article provides valuable insights into the potential memory vulnerabilities of password managers and offers practical suggestions for mitigating the identified risks. We will be keeping this article in mind while working on our memory model.
