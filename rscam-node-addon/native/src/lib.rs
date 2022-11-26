use std::io::Write;

use neon::prelude::*;
use neon::declare_types;
use neon::register_module;

use rscam;

trait SmartPush {
    type Item;
    fn smart_push(&mut self, item: Self::Item) -> usize;
}

impl<T> SmartPush for Vec<T> {
    type Item = T;
    fn smart_push(&mut self, item: T) -> usize {
        let idx = self.len();
        self.push(item);
        idx
    }
}

pub struct Webcam {
    index: usize // index inside cameras Vec
}

// TODO: Change to Vec<Maybe<rscam::Camera>>
// TODO: Reuse Empty values for allocating new cameras
// TODO: Create alloc and free functions
static mut CAMERAS: Vec<rscam::Camera> = Vec::new();

declare_types! {
    pub class JsWebcam for Webcam {
        init(mut cx) {
            let device = cx.argument::<JsString>(0)?.value();
            let mut camera = rscam::new(&device[..]).unwrap();
            camera.start(&rscam::Config {
                interval: (1, 30),      // 30 fps.
                resolution: (1920, 1080),
                format: b"MJPG",
                ..Default::default()
            }).unwrap();
            let index = unsafe {
                CAMERAS.smart_push(camera)
            };
            Ok(Webcam {
                index: index
            })
        }

        method capture(mut cx) {
            let this = cx.this();
            let guard = cx.lock();
            let index = this.borrow(&guard).index;

            let camera = unsafe {
                &CAMERAS[index]
            };
            let frame = camera.capture().unwrap();

            let mut buf = JsArrayBuffer::new(&mut cx, frame.len() as u32)?;
            cx.borrow_mut(&mut buf, |data| {
                let mut slice = data.as_mut_slice::<u8>();
                slice.write(&frame[..]).unwrap();
            });

            drop(frame);

            Ok(buf.upcast())
        }

    }
}

register_module!(mut cx, {
    cx.export_class::<JsWebcam>("Webcam")?;
    Ok(())
});
