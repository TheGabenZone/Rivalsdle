class GameAnimations {
    static async playVictoryAnimation(difficulty) {
        switch(difficulty) {
            case 'easy':
                await this.playConfetti();
                break;
            case 'medium':
                await this.playSparks();
                break;
            case 'hard':
                await this.playVolcanic();
                break;
        }
    }

    static async playConfetti() {
        // We'll implement confetti using a library
        const confetti = await import('https://cdn.skypack.dev/canvas-confetti');
        confetti.default({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }

    static async playSparks() {
        const container = document.createElement('div');
        container.className = 'sparkle-container';
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.pointerEvents = 'none';
        container.style.zIndex = '1000';
        document.body.appendChild(container);
        
        // Create sparkle elements
        for(let i = 0; i < 50; i++) {
            const spark = document.createElement('div');
            spark.className = 'sparkle';
            
            // Random starting position near the center
            const startX = 50 + (Math.random() - 0.5) * 20;
            const startY = 50 + (Math.random() - 0.5) * 20;
            
            // Random trajectory
            const tx = (Math.random() - 0.5) * 200;
            const ty = (Math.random() - 0.5) * 200;
            
            spark.style.left = `${startX}%`;
            spark.style.top = `${startY}%`;
            spark.style.setProperty('--tx', `${tx}px`);
            spark.style.setProperty('--ty', `${ty}px`);
            
            container.appendChild(spark);
        }
    
        return new Promise(resolve => setTimeout(() => {
            container.remove();
            resolve();
        }, 2000));
    }

    static async playVolcanic() {
        const container = document.createElement('div');
        container.className = 'volcanic-container';
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.pointerEvents = 'none';
        container.style.zIndex = '1000';
        document.body.appendChild(container);
        
        // Get the character image and prepare it for zoom animation
        const img = document.getElementById('character-image');
        img.style.display = 'block';
        img.style.transform = 'scale(0.1)';
        img.style.opacity = '0';
        img.style.transition = 'transform 3s ease-out, opacity 2s ease-in';
        
        // Start the zoom after a short delay
        setTimeout(() => {
            img.style.transform = 'scale(1)';
            img.style.opacity = '1';
        }, 100);
        
        // Create flame elements with staggered timing
        for(let i = 0; i < 30; i++) {
            setTimeout(() => {
                const flame = document.createElement('div');
                flame.className = 'flame';
                
                // Random horizontal position
                const startX = Math.random() * 100;
                flame.style.left = `${startX}%`;
                
                // Random size
                const size = 10 + Math.random() * 20;
                flame.style.width = `${size}px`;
                flame.style.height = `${size * 2}px`;
                
                // Random hue variation
                const hue = 15 + Math.random() * 30;
                flame.style.background = `linear-gradient(to top, 
                    hsl(${hue}, 100%, 50%), 
                    hsl(${hue + 20}, 100%, 70%))`;
                
                container.appendChild(flame);
                
                // Remove each flame after animation
                setTimeout(() => flame.remove(), 2000);
            }, i * 100);
        }
    
        // Return promise that resolves after zoom and flames complete
        return new Promise(resolve => setTimeout(() => {
            container.remove();
            img.style.transition = '';
            resolve();
        }, 3000));
    }
}