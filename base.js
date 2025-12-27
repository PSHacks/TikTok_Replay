        function isValidTikTokLink(url) {
            const tiktokRegex = /^(https?:\/\/)?((www|vm)\.)?tiktok\.com\/(@[\w.-]+|[\w.-]+)|@[\w.-]+$/i;
            return tiktokRegex.test(url.trim());
        }

        function startAnalysis() {
            const input = document.getElementById('tiktok-link');
            const link = input.value;
            const errorMsg = document.getElementById('error-message');

            if (!link || !isValidTikTokLink(link)) {
                input.classList.add('input-error');
                errorMsg.style.opacity = '1';
                setTimeout(() => {
                    input.classList.remove('input-error');
                    errorMsg.style.opacity = '0';
                }, 2000);
                return;
            }

            const welcome = document.getElementById('welcome-screen');
            const loading = document.getElementById('loading-screen');
            const content = document.getElementById('content-screen');
            const loadingText = document.getElementById('loading-text');
            const loadingSubtext = document.getElementById('loading-subtext');
            const progressBarUI = document.getElementById('loading-progress');

            welcome.style.opacity = '0';
            setTimeout(() => {
                welcome.style.display = 'none';
                loading.style.display = 'flex';
                loading.style.visibility = 'visible';
                loading.style.opacity = '1';
                
                runLoadingSequence(loadingText, loadingSubtext, progressBarUI, () => {
                    loading.style.opacity = '0';
                    setTimeout(() => {
                        loading.style.display = 'none';
                        content.style.display = 'block';
                        setTimeout(() => {
                            content.style.opacity = '1';
                            initObserver();
                        }, 50);
                    }, 500);
                });
            }, 500);
        }

        function runLoadingSequence(textEl, subtextEl, progressEl, callback) {
            const stages = [
                { t: "Обработка...", s: "Связь с профилем", p: 25, d: 800 },
                { t: "Анализ...", s: "История за 2025 год", p: 55, d: 1200 },
                { t: "Сбор...", s: "Взаимодействия и теги", p: 85, d: 1000 },
                { t: "Готово!", s: "Формирование отчета", p: 100, d: 800 }
            ];

            let currentStage = 0;
            function next() {
                if (currentStage < stages.length) {
                    textEl.innerText = stages[currentStage].t;
                    subtextEl.innerText = stages[currentStage].s;
                    progressEl.style.width = stages[currentStage].p + '%';
                    setTimeout(() => {
                        currentStage++;
                        next();
                    }, stages[currentStage].d);
                } else {
                    setTimeout(callback, 500);
                }
            }
            next();
        }

        const container = document.getElementById('container');
        const progressBar = document.getElementById('progressBar');

		function getRandomInt(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}

		function setRandomStats() {
			// Создаем объект с правилами: ID элемента -> [Мин, Макс]
			const config = {
				'stat-views':     { min: 15120, max: 96718 },
				'stat-streak':    { min: 182,   max: 580   },
				'stat-likes':     { min: 4712,  max: 14755 },
				'stat-bookmarks': { min: 422,   max: 1128  }
			};

			// Проходим по каждому ID в конфиге
			for (let id in config) {
				const element = document.getElementById(id);
				if (element) {
					const range = config[id];
					const randomVal = getRandomInt(range.min, range.max);
					element.setAttribute('data-value', randomVal);
				}
			}
		}

		function initObserver() {
			// 1. Сначала ставим случайные числа в data-value
			setRandomStats();

			const slides = document.querySelectorAll('.slide');
			const observerOptions = { threshold: 0.5 };

			const observer = new IntersectionObserver((entries) => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						entry.target.classList.add('active');
						const statValue = entry.target.querySelector('.stat-value');
						
						// Проверяем, что анимация еще не запускалась (текст равен "0")
						if (statValue && statValue.innerText === "0") { 
							animateValue(statValue); 
						}
					}
				});
			}, observerOptions);

			slides.forEach(slide => observer.observe(slide));
			
			// Активируем первый слайд сразу, если он виден
			if(slides[0]) slides[0].classList.add('active');
		}

		function animateValue(obj) {
			const endValue = parseFloat(obj.getAttribute('data-value'));
			const duration = 1500;
			let startTimestamp = null;

			const step = (timestamp) => {
				if (!startTimestamp) startTimestamp = timestamp;
				const progress = Math.min((timestamp - startTimestamp) / duration, 1);
				const current = progress * endValue;
				
				// Форматируем число (добавляем пробелы в разряды)
				obj.innerHTML = Math.floor(current).toLocaleString();

				if (progress < 1) { 
					window.requestAnimationFrame(step); 
				} else {
					// В конце ставим точное значение на всякий случай
					obj.innerHTML = Math.floor(endValue).toLocaleString();
				}
			};
			window.requestAnimationFrame(step);
		}

        container.addEventListener('scroll', () => {
            const scrollTop = container.scrollTop;
            const docHeight = container.scrollHeight - container.clientHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        });