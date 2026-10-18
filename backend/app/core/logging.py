from __future__ import annotations

import logging
import sys


def setup_logging(debug: bool = False) -> logging.Logger:
    """Configure structured logging for Jomir Dalal AI backend."""
    log_level = logging.DEBUG if debug else logging.INFO
    log_format = "%(asctime)s [%(levelname)s] [%(name)s]: %(message)s"

    logging.basicConfig(
        level=log_level,
        format=log_format,
        handlers=[
            logging.StreamHandler(sys.stdout),
        ],
    )

    logger = logging.getLogger("jomir_dalal")
    logger.setLevel(log_level)
    return logger
