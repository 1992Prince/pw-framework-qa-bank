# Cron Expression — Quick Notes

## First, remember this

5 stars we use for scheduling a cron job.

When someone asks *"schedule this job"* — then you ask: **kaunsa minute, kaunsa hour, kaunsa din?**

```
*  *  *  *  *
│  │  │  │  │
│  │  │  │  └── Day of Week (0-7, 0 aur 7 dono Sunday)
│  │  │  └───── Month (1-12)
│  │  └──────── Day of Month (1-31)
│  └─────────── Hour (0-23)
└────────────── Minute (0-59)
```

---

## Examples

### 1) Every minute — all hours, all days, all months, all weekdays

```
* * * * *
```

### 2) Schedule job at midnight (12 AM) daily

Raat ke 12 baje ka matlab hour = **0**.
Only minute part needs to be `0` — agar `*` rakha toh 12:00 se 1:00 ke beech har minute trigger hoga.

```
0 0 * * *
```

### 3) Schedule job at midnight, Monday to Friday (Nightly build)

```
0 0 * * 1-5
```

### 4) Schedule job at midnight, only Monday and Friday

```
0 0 * * 1,5
```

### 5) Schedule job on the 1st of every month at midnight

```
0 0 1 * *
```

### 6) Schedule job at fixed intervals

```
*/15 * * * *   → every 15 min
*/5  * * * *   → every 5 min
*/30 * * * *   → every 30 min
```

### 7) Every Sunday at 2:30 AM (weekly regression suite)

```
30 2 * * 0   or   30 2 * * 7
```

> Note: use `30 2 * * 0` (not `*/30`) if you want it to fire **exactly once** at 2:30 AM. `*/30 2 * * 0` would trigger twice — at 2:00 AM and 2:30 AM.
> Since `0` and `7` both mean Sunday.

### 8) Every weekday at 11 PM

```
0 23 * * 1-5
```

> `0` and `7` = Sunday, `6` = Saturday.

---

## Quick reference — Day of Week values

| Value  | Day       |
| ------ | --------- |
| 0 or 7 | Sunday    |
| 1      | Monday    |
| 2      | Tuesday   |
| 3      | Wednesday |
| 4      | Thursday  |
| 5      | Friday    |
| 6      | Saturday  |



Top 5 jo bar-bar puche jaate hain (SDET/DevOps/CI-CD interviews mein):

**1. "Explain the cron expression `0 0 * * *` — what does it mean?"**
Sabse basic hota hai — check karte hain ki tumhe field order (min-hour-day-month-weekday) yaad hai ya nahi. Answer: daily midnight.

**2. "Write a cron expression to run a job every 5 minutes."**
`*/5 * * * *` — step/interval symbol ka use test karta hai.

**3. "What's the difference between `*` and `?` in cron?"**
Trap question hai. Plain Unix cron mein `?` exist hi nahi karta — sirf Quartz scheduler (Jenkins jaise tools) mein hota hai, jab day-of-month aur day-of-week dono conflict karte hain, tab `?` "don't care" ke liye use hota hai.

**4. "How is Jenkins cron different from standard Unix/Linux cron?"**
Jenkins ka `H` (hash) symbol — `H * * * *` jaisa. Isse Jenkins automatically ek consistent-but-randomized minute assign karta hai taaki multiple jobs same time pe fire na hon aur server load spike na ho.

**5. "How would you schedule a job to run every weekday at a specific time, and how would you handle holidays/exclusions?"**
Ye tumhara practical/real-world understanding check karta hai — cron sirf time-trigger hai, business logic (holidays) usse handle nahi hota. Us case mein application-level check ya CI tool ka calendar plugin chahiye.

**Bonus tip:** interviewer aksar ek random expression bolke poochta hai *"jaldi bolo iska matlab kya hai"* — speed aur field-order confidence dono test karne ke liye. Isliye 5-field structure muh-zabani (rote) yaad hona zaroori hai.
